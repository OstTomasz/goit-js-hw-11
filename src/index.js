import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './sass/index.scss';

const searchForm = document.querySelector('.search-form');
let searchFormInput = document.querySelector(`input[name="searchQuery"]`);
let searchString;
const picturesList = document.querySelector('.pictures');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchString = searchFormInput.value;
  const APIURL = `https://pixabay.com/api/`;
  const params = new URLSearchParams({
    key: '35169635-92091552d9eccdba3eb57d7a9',
    // q: 'dog in the fog',
    q: searchString,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  const fetchPictures = async () => {
    const response = await fetch(APIURL + '?' + params);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const pictures = await response.json();
    return pictures.hits;
  };

  fetchPictures().then(pictures => {
    console.log(pictures);
    if (pictures.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    picturesList.innerHTML = pictures
      .map(picture => {
        return `<li class="pictures-element">
            <img class="pictures-element_pic" src=${picture.webformatURL} alt=${picture.tags} loading="lazy" />
          <div class="pictures-element_pic-description">
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Likes</p><p class="pictures-element_value">${picture.likes}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Views</p><p class="pictures-element_value">${picture.views}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Comments</p><p class="pictures-element_value">${picture.comments}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Downloads</p><p class="pictures-element_value">${picture.downloads}</p></div>
          </div>
          </li>`;
      })
      .join('');
  });
});

const { height: cardHeight } =
  picturesList.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});

// ADD PAGINATION picturesList.addEventListener('scroll', e => {});
