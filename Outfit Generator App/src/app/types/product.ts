export interface ProductOffer {
    price?: string;
    store_name?: string;
    offer_page_url?: string;
  }
  
  export interface Product {
    product_id?: string;
    product_title: string;
    product_photo?: string;
    product_photos?: string[];
    product_page_url?: string;
    product_source?: string;
    typical_price_range?: string[];
    offer?: ProductOffer;
  }