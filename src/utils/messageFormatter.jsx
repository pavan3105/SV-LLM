/**
 * Message content formatter to improve rendering of SVA content
 * This utility helps format message content for better display
 */

/**
 * Clean up SVA content for display
 * @param {string} svaContent - The SVA content to clean
 * @returns {string} - Cleaned SVA content
 */
export const cleanSVAContent = (svaContent) => {
    if (!svaContent) return '';
    
    // Remove excessive whitespace at start and end
    let cleaned = svaContent.trim();
    
    // Normalize line breaks
    cleaned = cleaned.replace(/\r\n/g, '\n');
    
    // Remove more than two consecutive empty lines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    // Remove extra spaces at the beginning of lines but preserve indentation
    cleaned = cleaned.replace(/^[ \t]+(.+)$/gm, (match, content) => {
      // Calculate the appropriate indentation level (multiples of 2 spaces)
      const spaces = match.length - content.length;
      const indentLevel = Math.floor(spaces / 2);
      return '  '.repeat(indentLevel) + content;
    });
    
    return cleaned;
  };
  
  /**
   * Extract SVA content from message
   * @param {string} content - The message content
   * @returns {Object} - Object with svaContent and contentWithoutSva
   */
  export const extractSVAContent = (content) => {
    if (!content) return { svaContent: null, contentWithoutSva: '' };
    
    // Try various SVA code block patterns
    const patterns = [
      /```sva\s*([\s\S]*?)```/g,
      /```systemverilog\s*([\s\S]*?)```/g,
      /```verilog\s*([\s\S]*?)```/g,
      /```\s*```(?:sva|systemverilog|verilog)\s*([\s\S]*?)```\s*```/g
    ];
    
    for (const pattern of patterns) {
      const match = pattern.exec(content);
      if (match && match[1]) {
        const svaContent = cleanSVAContent(match[1]);
        const contentWithoutSva = content.replace(match[0], '').trim();
        return { svaContent, contentWithoutSva };
      }
    }
    
    return { svaContent: null, contentWithoutSva: content };
  };
  
  /**
   * Clean and format text content for better display
   * @param {string} content - The text content to format
   * @returns {string} - Formatted text content
   */
  export const formatTextContent = (content) => {
    if (!content) return '';
    
    // Trim outer whitespace
    let formatted = content.trim();
    
    // Remove excessive line breaks
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Ensure proper spacing after headers
    formatted = formatted.replace(/^(#+.+)$/gm, '$1\n');
    
    // Fix list items
    formatted = formatted.replace(/^(\s*)(\*|-)\s+/gm, (match, spaces, bullet) => {
      const level = Math.floor(spaces.length / 2);
      return `${'  '.repeat(level)}${bullet} `;
    });
    
    // Format titles with colons
    formatted = formatted.replace(/^([A-Za-z0-9\s]+):\s*$/gm, '**$1:**');
    
    // Format list items with titles
    formatted = formatted.replace(/^(\s*)(\*|-)\s+([A-Za-z0-9\s]+):\s*/gm, 
      '$1$2 **$3:** ');
    
    return formatted;
  };
  
  /**
   * Clean and format code blocks to maintain proper syntax highlighting
   * @param {string} content - Content with code blocks
   * @returns {string} - Content with properly formatted code blocks
   */
  export const formatCodeBlocks = (content) => {
    if (!content) return '';
    
    // Fix code blocks
    return content.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, language, code) => {
      // Clean up code indentation
      const cleanedCode = code.replace(/^[ \t]+(.+)$/gm, (match, content) => {
        // Calculate the appropriate indentation level (multiples of 2 spaces)
        const spaces = match.length - content.length;
        const indentLevel = Math.floor(spaces / 2);
        return '  '.repeat(indentLevel) + content;
      });
      
      return `\`\`\`${language}\n${cleanedCode.trim()}\n\`\`\``;
    });
  };