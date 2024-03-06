import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { vectorStore } from "./embeddings.js";
const retriever = vectorStore.asRetriever();
const outputParser = new StringOutputParser();

// const chatModel = new ChatOllama({
//   baseUrl: "http://localhost:11434", // Default value
//   model: "gemma:2b",
// });

const chatModel = new ChatOpenAI({});

// const prompt = ChatPromptTemplate.fromMessages([
//   ["system", "You are a world class economist"],
//   ["user", "{input}"],
// ]);

const prompt =
  ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {input}`);

// const chain = prompt.pipe(chatModel);
// const llmChain = prompt.pipe(chatModel).pipe(outputParser);

const documentChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt,
});
const retrievalChain = await createRetrievalChain({
  combineDocsChain: documentChain,
  retriever,
});

async function ask(input) {
  try {
    const result = await retrievalChain.invoke({
      input: input,
    });

    return result?.answer;
  } catch (err) {
    console.log("Error in chat invoke", err);
  }
}

export { ask };
