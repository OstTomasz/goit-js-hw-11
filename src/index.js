import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('.search-form');
let searchFormInput = document.querySelector(`input[name="searchQuery"]`);
let searchString;
const picturesList = document.querySelector('.pictures-list');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchString = searchFormInput.value;
  const APIURL = `https://pixabay.com/api/`;
  const params = new URLSearchParams({
    key: '35169635-92091552d9eccdba3eb57d7a9',
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

    console.log('pictures:', pictures);
    return pictures;
  };

  fetchPictures();
});
