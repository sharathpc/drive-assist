import { DirectoryLoader, } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { InMemoryStore } from "langchain/storage/in_memory";
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";

import { OLLAMA_EMBEDDINGS_MODEL, OLLAMA_MODEL, OLLAMA_URL } from "./constants";
import { ChatOllama } from "@langchain/community/chat_models/ollama";

declare const globalThis: {
    retriever: any;
} & typeof global;

const directoryLoader = new DirectoryLoader(
    "src/data",
    {
        ".pdf": (path: string) => new PDFLoader(path),
    }
);

const embeddingsModel = new OllamaEmbeddings({
    model: OLLAMA_EMBEDDINGS_MODEL,
    baseUrl: OLLAMA_URL,
})

const llm = new ChatOllama({
    baseUrl: OLLAMA_URL,
    model: OLLAMA_MODEL,
    temperature: 0,
})

const retriever = new ParentDocumentRetriever({
    vectorstore: new MemoryVectorStore(embeddingsModel),
    docstore: new InMemoryStore(),
    // Optional, not required if you're already passing in split documents
    parentSplitter: new RecursiveCharacterTextSplitter({
        chunkOverlap: 0,
        chunkSize: 1024,
    }),
    childSplitter: new RecursiveCharacterTextSplitter({
        chunkOverlap: 0,
        chunkSize: 256,
    }),
    //documentCompressor: LLMChainExtractor.fromLLM(llm),
    // Optional `k` parameter to search for more child documents in VectorStore.
    // Note that this does not exactly correspond to the number of final (parent) documents
    // retrieved, as multiple child documents can point to the same parent.
    childK: 20,
    // Optional `k` parameter to limit number of final, parent documents returned from this
    // retriever and sent to LLM. This is an upper-bound, and the final count may be lower than this.
    parentK: 5,
});

const processDocsSingleton = async () => {
    console.log("Processing Docs Started:::");
    const parentDocuments = await directoryLoader.load();
    console.log("Loaded Docs:::")
    try{
        await retriever.addDocuments(parentDocuments);
    }catch(e){
        console.log(e);
    }
    console.log("Processing Docs Ended:::");
    return retriever;
}

const processDocsStore = async (reset: boolean = false) => {
    return globalThis.retriever = (reset ?
        await processDocsSingleton() :
        globalThis.retriever ?? await processDocsSingleton()
    );
}

export default processDocsStore;