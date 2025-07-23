// Product images mapping for gas cylinders
export const productImages = {
  // 6kg cylinders
  "6kg-afri-gas": "/images/6kg-afri-gas.png",
  "6kg-k-gas": "/images/6kg-k-gas.png", 
  "6kg-ola-gas": "/images/6kg-ola-gas.png",
  "6kg-pro-gas": "/images/6kg-pro-gas.png",
  "6kg-total": "/images/6kg-total.jpg",
  
  // 13kg cylinders
  "13kg-afrigas": "/images/13kg-afrigas.png",
  "13kg-k-gas": "/images/13kg-k-gas.png",
  "13kg-ola-gas": "/images/13kg-ola-gas.jpg",
  "13kg-pro-gas": "/images/13kg-pro-gas.png",
  "13kg-total": "/images/13kg-total.png",
  
  // 45kg cylinders
  "45kg-afri-gas": "/images/45kg-afri-gas.png",
  
  // 50kg cylinders
  "50kg-k-gas": "/images/50kg-k-gas.png",
  "50kg-pro-gas": "/images/50kg-pro-gas.png",
  "50kg-total": "/images/50kg-total.png"
};

// Function to get image for a product
export const getProductImage = (productName) => {
  if (!productName) {
    return "/images/6kg-afri-gas.png"; // Default fallback image
  }

  // Convert product name to lowercase for matching
  const normalizedName = productName.toLowerCase();
  
  // Direct mappings for exact product names from database
  const directMappings = {
    // Exact matches from database
    "13kg afrigas": "/images/13kg-afrigas.png",
    "13kg k-gas": "/images/13kg-k-gas.png",
    "13kg ola-gas": "/images/13kg-ola-gas.jpg",
    "13kg pro-gas": "/images/13kg-pro-gas.png",
    "13kg total": "/images/13kg-total.png",
    "45kg afrigas": "/images/45kg-afri-gas.png",
    "50kg k-gas": "/images/50kg-k-gas.png",
    "50kg pro-gas": "/images/50kg-pro-gas.png",
    "50kg total": "/images/50kg-total.png",
    "6kg afrigas": "/images/6kg-afri-gas.png",
    "6kg k-gas": "/images/6kg-k-gas.png",
    "6kg ola-gas": "/images/6kg-ola-gas.png",
    "6kg pro-gas": "/images/6kg-pro-gas.png",
    "6kg total": "/images/6kg-total.jpg"
  };
  
  // Try direct mapping first
  if (directMappings[normalizedName]) {
    return directMappings[normalizedName];
  }
  
  // Extract size and brand from product name
  let size = '';
  let brand = '';
  
  // Extract size (6kg, 13kg, 45kg, 50kg, etc.)
  const sizeMatch = normalizedName.match(/(\d+kg)/);
  if (sizeMatch) {
    size = sizeMatch[1];
  }
  
  // Extract brand from common patterns
  if (normalizedName.includes('total')) {
    brand = 'total';
  } else if (normalizedName.includes('k-gas')) {
    brand = 'k-gas';
  } else if (normalizedName.includes('pro-gas')) {
    brand = 'pro-gas';
  } else if (normalizedName.includes('afrigas') || normalizedName.includes('afri-gas') || normalizedName.includes('afrigas')) {
    brand = 'afri-gas';
  } else if (normalizedName.includes('ola-gas')) {
    brand = 'ola-gas';
  }
  
  // Try to construct the key and find the image
  if (size && brand) {
    const key = `${size}-${brand}`;
    if (productImages[key]) {
      return productImages[key];
    }
  }
  
  // Try exact match first
  if (productImages[normalizedName]) {
    return productImages[normalizedName];
  }
  
  // Try variations of the constructed key
  if (size && brand) {
    const variations = [
      `${size}-${brand}`,
      `${size}-${brand.replace('-', '')}`,
      `${size}-${brand.replace('gas', 'gas')}`,
      `${size}-${brand.replace('afrigas', 'afri-gas')}`,
      `${size}-${brand.replace('afri-gas', 'afrigas')}`
    ];
    
    for (const variation of variations) {
      if (productImages[variation]) {
        return productImages[variation];
      }
    }
  }
  
  // Try partial matches
  for (const [key, image] of Object.entries(productImages)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return image;
    }
  }
  
  // Return default image if no match found
  return "/images/6kg-afri-gas.png"; // Default fallback image
};

// Function to get all available images
export const getAllProductImages = () => {
  return Object.values(productImages);
};

// Function to get image by size and brand
export const getImageBySizeAndBrand = (size, brand) => {
  const key = `${size}-${brand}`.toLowerCase().replace(/\s+/g, '-');
  return productImages[key] || "/images/6kg-afri-gas.png";
}; 