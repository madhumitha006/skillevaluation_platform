const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const path = require('path');

class FileParser {
  async parsePDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  async parseText(filePath) {
    try {
      const text = await fs.readFile(filePath, 'utf-8');
      return text;
    } catch (error) {
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  }

  async parseFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.pdf':
        return await this.parsePDF(filePath);
      case '.txt':
        return await this.parseText(filePath);
      case '.doc':
      case '.docx':
        // For DOC/DOCX, you'd need additional libraries like mammoth
        // For now, return a placeholder
        return 'DOC/DOCX parsing requires additional setup';
      default:
        throw new Error('Unsupported file type');
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${error.message}`);
    }
  }
}

module.exports = new FileParser();
