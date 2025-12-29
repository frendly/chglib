// src/_data/newsUtils.js

const clearText = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove markdown links
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();
};

/**
 * Generates a meta description from a list of posts.
 * @param {Array} posts - The array of post objects.
 * @param {number} [limit=4] - The number of posts to use for the description.
 * @param {number} [maxLength=160] - The maximum length of the description.
 * @returns {string} The generated meta description.
 */
const generateMetaDescription = (posts, limit = 4, maxLength = 160) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return "";
  }

  const shortNews = posts.slice(0, limit);

  let description = shortNews
    .map((post) => clearText(post.inputContent))
    .join(" ");

  if (description.length > maxLength) {
    description = description.slice(0, maxLength);
    // Ensure the truncation happens at a word boundary.
    const lastSpace = description.lastIndexOf(" ");
    if (lastSpace > 0) {
      description = description.slice(0, lastSpace);
    }
    description += "...";
  }

  return description;
};

export default {
  generateMetaDescription,
};
