import axios from 'axios';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import * as util from 'util';
import * as yargs from 'yargs';

dotenv.config();
const execPromise = util.promisify(exec);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

interface DubbingRequest {
  file_path: string;
  target_language: string;
  output_file: string;
}

async function extractAudio(videoPath: string, audioPath: string): Promise<void> {
  console.log(`Extracting audio from ${videoPath} to ${audioPath}...`);
  const command = `ffmpeg -i "${videoPath}" -vn -acodec pcm_s16le -ar 44100 -ac 2 "${audioPath}"`;
  await execPromise(command);
  console.log('Audio extraction complete.');
}

async function dubAudio(audioPath: string, targetLanguage: string): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not set in .env file.');
  }

  console.log(`Dubbing audio to ${targetLanguage} using ElevenLabs API...`);
  const url = `${ELEVENLABS_API_BASE}/dubbing`;
  const formData = new FormData();
  formData.append('audio_file', new Blob([await (await fetch(`file://${audioPath}`)).arrayBuffer()]), 'input_audio.wav');
  formData.append('target_language', targetLanguage);

  const response = await axios.post(url, formData, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'arraybuffer',
  });

  const dubbedAudioPath = `dubbed_${targetLanguage}.mp3`;
  await util.promisify(require('fs').writeFile)(dubbedAudioPath, response.data);
  console.log(`Dubbed audio saved to ${dubbedAudioPath}`);
  return dubbedAudioPath;
}

async function mergeAudioWithVideo(videoPath: string, dubbedAudioPath: string, outputPath: string): Promise<void> {
  console.log(`Merging dubbed audio with video to ${outputPath}...`);
  const command = `ffmpeg -i "${videoPath}" -i "${dubbedAudioPath}" -c:v copy -map 0:v:0 -map 1:a:0 "${outputPath}"`;
  await execPromise(command);
  console.log('Merge complete.');
}

async function automateDemoLocalization(request: DubbingRequest): Promise<void> {
  const { file_path, target_language, output_file } = request;
  const tempAudioPath = 'temp_extracted_audio.wav';

  try {
    await extractAudio(file_path, tempAudioPath);
    const dubbedAudioPath = await dubAudio(tempAudioPath, target_language);
    await mergeAudioWithVideo(file_path, dubbedAudioPath, output_file);
    console.log(`Successfully localized demo to ${output_file}`);
  } catch (error) {
    console.error('Error during localization:', error);
  } finally {
    // Clean up temporary files
    execPromise(`rm -f ${tempAudioPath} dubbed_${target_language}.mp3`).catch(console.error);
  }
}

const argv = yargs
  .option('input-file', {
    alias: 'i',
    description: 'Path to the input video/audio file',
    type: 'string',
    demandOption: true,
  })
  .option('target-language', {
    alias: 't',
    description: 'Target language for dubbing (e.g., es, fr, de)',
    type: 'string',
    demandOption: true,
  })
  .option('output-file', {
    alias: 'o',
    description: 'Path for the output localized video/audio file',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h')
  .argv as DubbingRequest;

automateDemoLocalization(argv);
