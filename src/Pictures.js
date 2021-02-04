import React, { useState, useEffect } from 'react';

import 'swiper/swiper-bundle.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Thumbs, Autoplay, Navigation, Pagination } from 'swiper';
const FLICKR_API_KEY = 'daad5c6194666cd0ee23c9e6b0d2d000';

const Pictures = ({ city, isSubmitted, setCity, cities }) => {
  const [images, setImages] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState();
  SwiperCore.use([EffectFade, Autoplay, Navigation, Pagination]);
  const fetchPictures = async value => {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=${value}&text=${
      value + ' city'
    }&safe_search=1&per_page=6&content_type=1&sort=relevance&format=json&nojsoncallback=1`;
    const response = await fetch(url);
    const result = await response.json();

    const pics = result.photos.photo.map(pic => {
      const { server, id, secret } = pic;
      const src = `https://live.staticflickr.com/${server}/${id}_${secret}_c.jpg`;
      return src;
    });
    setImages(pics);
    setCity('');
  };

  if (isSubmitted) {
    fetchPictures(city);
  }

  return (
    <>
      <div className="images">
        {images.length > 0 && (
          <>
            {cities.length > 0 && (
              <h2>And some pictures from {cities[cities.length - 1].name} for you to check!</h2>
            )}
            <Swiper
              id="main"
              thumbs={{ swiper: thumbsSwiper }}
              tag="section"
              wrapperTag="ul"
              effect="fade"
              navigation
              pagination
              autoplay={{
                delay: 3000,
              }}
              spaceBetween={0}
              slidesPerView={1}
              onInit={swiper => console.log('Swiper initialized!', swiper)}
              onSlideChange={swiper => {
                console.log('Slide index changed to: ', swiper.activeIndex);
              }}
              onReachEnd={() => console.log('Swiper end reached')}
            >
              {images.map((img, idx) => {
                return (
                  <SwiperSlide key={idx} tag="li">
                    <div
                      className="image-container"
                      style={{ backgroundImage: `url(${img})` }}
                    ></div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )}
      </div>
    </>
  );
};

export default Pictures;
