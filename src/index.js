import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './sass/index.scss';
// Opisany w dokumentacji
import SimpleLightbox from 'simplelightbox';
// Dodatkowy import stylów
import 'simplelightbox/dist/simple-lightbox.min.css';
// Add imports above this line

const searchForm = document.querySelector('.search-form');
let searchFormInput = document.querySelector(`input[name="searchQuery"]`);
let searchString;
const picturesList = document.querySelector('.pictures');
const loadMore = document.querySelector('.load-more');
let listMarkup = '';
let page = 1;

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;

  searchString = searchFormInput.value;
  const APIURL = `https://pixabay.com/api/`;
  const params = new URLSearchParams({
    key: '35169635-92091552d9eccdba3eb57d7a9',
    q: searchString,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  });

  if (searchString) {
    const fetchPictures = async page => {
      const response = await fetch(APIURL + '?' + params + '&page=' + page);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const pictures = await response.json();
      if (page === 1) {
        if (pictures.hits.length > 0) {
          Notify.info(`Hooray! We found ${pictures.total} images.`);
        }
      }
      return pictures.hits;
    };

    fetchPictures(page)
      .then(pictures => {
        if (pictures.length === 0) {
          loadMore.style.visibility = 'hidden';
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        listMarkup = pictures
          .map(picture => {
            return `<li class="pictures-element">
            <a href= "${picture.largeImageURL}"><img class="pictures-element_pic" src=${picture.webformatURL} alt=${picture.tags} loading="lazy" /></a>
          <div class="pictures-element_pic-description">
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Likes</p><p class="pictures-element_value">${picture.likes}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Views</p><p class="pictures-element_value">${picture.views}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Comments</p><p class="pictures-element_value">${picture.comments}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Downloads</p><p class="pictures-element_value">${picture.downloads}</p></div>
          </div>
          </li>`;
          })
          .join('');
        picturesList.innerHTML = listMarkup;
        let lightbox = new SimpleLightbox('.pictures a', {
          captionsData: 'alt',
          captionDelay: 250,
          animationSpeed: 250,
          fadeSpeed: 250,
          scrollZoom: false,
          showCounter: false,
        });
      })
      .finally(() => {
        if (picturesList.innerHTML !== '') {
          loadMore.style.visibility = 'visible';
        }
      });

    loadMore.addEventListener('click', () => {
      page = page + 1;
      fetchPictures(page)
        .then(pictures => {
          listMarkup = pictures
            .map(picture => {
              return `<li class="pictures-element">
          <a href= "${picture.largeImageURL}"><img class="pictures-element_pic" src=${picture.webformatURL} alt=${picture.tags} loading="lazy" /></a>
          <div class="pictures-element_pic-description">
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Likes</p><p class="pictures-element_value">${picture.likes}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Views</p><p class="pictures-element_value">${picture.views}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Comments</p><p class="pictures-element_value">${picture.comments}</p></div>
          <div class = "pictures-element_pic-description-element"><p class="pictures-element_pic-description-element_header">Downloads</p><p class="pictures-element_value">${picture.downloads}</p></div>
          </div>
          </li>`;
            })
            .join('');
          picturesList.insertAdjacentHTML('beforeend', listMarkup);
          let lightbox = new SimpleLightbox('.pictures a', {
            captionsData: 'alt',
            captionDelay: 250,
            animationSpeed: 250,
            fadeSpeed: 250,
            scrollZoom: false,
            showCounter: false,
          });
        })
        .then(() => {
          loadMore.style.visibility = 'visible';
        })
        .catch(() => {
          loadMore.style.visibility = 'hidden';
          Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        });
    });
  }
});
SimpleLightbox('.pictures a', {
  captionsData: 'alt',
  captionDelay: 250,
  animationSpeed: 250,
  fadeSpeed: 250,
  scrollZoom: false,
  showCounter: false,
});
// const { height: cardHeight } =
//   picturesList.firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// ADD PAGINATION picturesList.addEventListener('scroll', e => {});
