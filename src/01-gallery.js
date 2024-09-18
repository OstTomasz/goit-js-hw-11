import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#form');
const input = document.querySelector('#form-input');
const loader = document.querySelector('#loader');
const gallery = document.querySelector('#gallery');

let searchString = '';
const APIURL = `https://pixabay.com/api/`;

form.addEventListener('submit', e => {
  e.preventDefault();
  searchString = input.value;
  const params = new URLSearchParams({
    key: '35169635-92091552d9eccdba3eb57d7a9',
    q: searchString,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'false',
  });

  if (searchString !== '') {
    loader.classList.remove('visibility');
    fetch(APIURL + '?' + params)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status, response.statusText);
        }
        loader.classList.add('visibility');
        return response.json();
      })
      .then(response => {
        if (response.hits.length === 0) {
          iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
        }
        console.log(response.hits);
        input.value = '';
      })
      .catch(error => console.log(error));
  } else {
    iziToast.info({
      message: 'Type search params!',
    });
  }
});
