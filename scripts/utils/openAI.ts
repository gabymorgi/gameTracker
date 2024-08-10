/* eslint-disable no-console */
import { OpenAI } from "openai";
import fs from "fs";

// validating	the input file is being validated before the batch can begin
// failed	the input file has failed the validation process
// in_progress	the input file was successfully validated and the batch is currently being run
// finalizing	the batch has completed and the results are being prepared
// completed	the batch has been completed and the results are ready
// expired	the batch was not able to be completed within the 24-hour time window
// cancelling	the batch is being cancelled (may take up to 10 minutes)
// cancelled	the batch was cancelled

export default class OpenAIClient {
  private static instance: OpenAI;

  // avoid instantiation
  private constructor() {}

  public static getInstance(): OpenAI {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return OpenAIClient.instance;
  }

  public static async fileCreateBatch(
    inputFile: string,
  ): Promise<OpenAI.Files.FileObject> {
    const openai = OpenAIClient.getInstance();
    const file = await openai.files.create({
      file: fs.createReadStream(inputFile),
      purpose: "batch",
    });
    return file;
  }

  public static async fileList(): Promise<OpenAI.Files.FileObjectsPage> {
    const openai = OpenAIClient.getInstance();
    const list = await openai.files.list();

    return list;
  }

  public static async fileRetrieve(
    fileId: string,
  ): Promise<OpenAI.Files.FileObject> {
    const openai = OpenAIClient.getInstance();
    const file = await openai.files.retrieve(fileId);

    return file;
  }

  public static async fileRetrieveContent(fileId: string, outputFile: string) {
    const openai = OpenAIClient.getInstance();
    const response = await openai.files.content(fileId);

    // Asegúrate de que la respuesta está bien
    if (response.status === 200) {
      // Convierte el stream a Buffer
      const buffer = await response.arrayBuffer();

      // Escribe el buffer a un archivo en disco
      await fs.promises.writeFile(outputFile, Buffer.from(buffer));
      console.log("Archivo guardado exitosamente!");
    } else {
      console.log("Error al descargar el archivo:", response.statusText);
    }
  }

  public static async fileDelete(
    fileId: string,
  ): Promise<OpenAI.Files.FileDeleted> {
    const openai = OpenAIClient.getInstance();
    const file = await openai.files.del(fileId);
    console.log("File deleted:", file);

    return file;
  }

  public static async bactchCreate(
    fileId: string,
  ): Promise<OpenAI.Batches.Batch> {
    const openai = OpenAIClient.getInstance();
    const batch = await openai.batches.create({
      input_file_id: fileId,
      endpoint: "/v1/chat/completions",
      completion_window: "24h",
    });

    return batch;
  }

  public static async batchRetrieve(
    batchId: string,
  ): Promise<OpenAI.Batches.Batch> {
    const openai = OpenAIClient.getInstance();
    const batch = await openai.batches.retrieve(batchId);

    return batch;
  }
}
