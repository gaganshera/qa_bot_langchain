import "dotenv/config";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";


// Create docs with a loader
const loader = new PDFLoader("./data/document.pdf");
const docs = await loader.load();

// Load the docs into the vector store
const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
);

export { vectorStore };
