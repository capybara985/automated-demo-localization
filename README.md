# Automated-Demo-Localization

## Streamlining Global Sales with AI-Powered Demo Localization

This project presents a tool designed to automate the localization of product demo videos and audio for global sales teams using the ElevenLabs Dubbing API. By leveraging advanced AI voice technology, it aims to significantly reduce the time and resources required to adapt sales collateral for diverse linguistic markets, enabling faster market penetration and enhanced customer engagement.

## Features

- **Automated Dubbing**: Integrates with ElevenLabs Dubbing API to automatically translate and re-dub audio/video content into multiple languages.
- **Script Extraction & Translation**: Extracts spoken content from demos, translates it, and prepares it for dubbing.
- **Multi-language Support**: Supports a wide range of languages offered by ElevenLabs, facilitating global reach.
- **Batch Processing**: Efficiently localizes multiple demo files in a single operation.
- **Quality Control Integration**: Provides mechanisms for reviewing and fine-tuning dubbed content to ensure accuracy and natural delivery.

## Technical Stack

- **TypeScript/Node.js**: For orchestrating the localization workflow and interacting with APIs.
- **ElevenLabs Dubbing API**: Core technology for AI-powered voice localization.
- **FFmpeg (via child process)**: For audio/video manipulation (e.g., extracting audio, merging dubbed audio with video).
- **Cloud Storage (e.g., S3)**: For managing source and localized media files.

## Getting Started

### Prerequisites

- Node.js (LTS version)
- ElevenLabs API Key
- FFmpeg installed and accessible in your system PATH.

### Installation

```bash
git clone https://github.com/Capybara985/automated-demo-localization.git
cd automated-demo-localization
npm install
```

### Configuration

Create a `.env` file in the root directory and add your ElevenLabs API key and cloud storage credentials:

```
ELEVENLABS_API_KEY=your_elevenlabs_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
```

### Usage

To localize a demo video:

```bash
npm start -- --input-file=path/to/your/demo.mp4 --target-language=es --output-file=path/to/your/localized_demo_es.mp4
```

Refer to the `src/index.ts` for more command-line options and examples.

## Contributing

Contributions are welcome! Please refer to the `CONTRIBUTING.md` for guidelines.

## License

This project is licensed under the MIT License.
