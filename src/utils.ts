import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import marked from 'marked';

/**
 * Send an API error response
 */
export function sendErrorResponse(
  res: Response, 
  statusCode: number, 
  message: string, 
  error?: Error
): Response {
  console.error(`Error: ${message}`, error);
  
  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && error ? { 
      stack: error.stack, 
    } : {})
  });
}

/**
 * Create a handler to render markdown documentation
 */
export function createDocumentationHandler(mdFilePath: string, title: string) {
  return (req: any, res: Response) => {
    try {
      const mdPath = path.join(__dirname, mdFilePath);
      const markdownContent = fs.readFileSync(mdPath, 'utf8');
      const htmlContent = marked.parse(markdownContent);
      
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto; }
            pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
            code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
    } catch (error) {
      sendErrorResponse(res, 500, 'Failed to load documentation', error as Error);
    }
  };
}