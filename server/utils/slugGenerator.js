function generateSlug(title) {
  if (!title) return '';
  return title
  .toLowerCase()  
  .trim()  
  .replace(/\s+/g, '-') 
  .replace(/^-+|-+$/g, '');  

}

module.exports = generateSlug;
