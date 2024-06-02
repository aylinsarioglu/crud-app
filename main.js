//* Düzenleme Seçenekleri
let editFlag = false; //*Düzenleme modunda olup olmadığını belirtir.
let editElement; //* Düzenleme yapılan öğeyi temsil eder.
let editID = ""; //* Düzenleme yapılan öğrenin benzersiz kimliği

//* Gerekli HTML elementlerini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//! Fonksiyonlar

const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSiblings; //* Düzenleme yapacağımız etiketi seçtik.
  grocery.value = editElement.innerText; //* Düzenlediğimiz etiketin içeriğini inputa aktardık.
  editFlag = true;
  editID = element.dataset.id; //* Düzenlenen öğenin kimliğini gönderdik.
  submitBtn.textContent = "Düzenle";
  //* Düzenle butonuna tıklanıldığında Ekle butonu Düzenle olarak değiştin.
  console.log(editID);
};

//* Ekrana bildirim bastıracak fonksiyondur.
const displayAlert = (text, action) => {
  alert.textContent = text; //* alert classlı etiketin içerisini dışarıdan gönderilen parametre ile değiştirdik.
  alert.classList.add(`alert-${action}`); //* p etiketin dinamik class ekledik.

  setTimeout(() => {
    alert.textContent = ""; //* p etiketinin içerisini boş stringe çevirdik.
    alert.classList.remove(`alert-${action}`); //* p etiketine dinamik class ekledik.
  }, 2000);
};

const addItem = (e) => {
  e.preventDefault(); //* Formun gönderilme olayında sayfanın yenilenmesini engeller.
  const value = grocery.value; //* Inputun içerisine girilen değeri aldık.
  const id = new Date().getTime().toString(); //* Benzersiz bir id oluşturduk.

  //* Eğer inputun içerisi boş değilse ve düzenleme modunda değilse;

  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* Yeni bir "article" öğesi oluştur.
    let attr = document.createAttribute("data-id"); //* Yeni bir veri kimliği oluştur.
    attr.value = id;
    element.setAttributeNode(attr); //* Oluşturduğumuz idyi data özellik olarak set ettik.
    element.classList.add("grocery-item"); //* article etiketine class ekledik.
  
    element.innerHTML = `
        <p class = "title" > ${value} </p> 
        <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
        </div> 
    `;
    //* Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", deleteItem);
    list.appendChild(element); //* Oluşturduğumuz "article" etiketini HTMLe ekledik.
    displayAlert("Başarıyla Eklenildi", "success");
    //* Varsayılan değerlere dönderecek fonksiyon
    setBackToDefault();
    addToLocalStorage(id, value);
  } else if (value !== "" && editFlag) {
    editElement.innerText = value; //* Güncelleyeceğimiz elemanın içeriğini değiştirdik.
    displayAlert("Başarıyla Değiştirildi", "success");
    console.log(editID);
    editLocalStore(editID, value);
    setBackToDefault();
  }
};
//* Varsayılan değerlere dönderir.
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};
//* Silme butonuna tıklanıldığında çalışır.
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement; //* Sileceğimiz etikete kapsayıcıları yardımı ile ulaştık.
  console.log(element);
  list.removeChild(element); //* Bulduğumuz "article" etiketini list alanı içerisinden kaldırdık.
  displayAlert("Başarıyla Kaldırıldı", "danger"); //* Ekrana gönderdiğimiz parametrelere göre bildirim bastırır.

  removeFromLocalStorage(id);
};

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  //* Listede article etiketi var mı 
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item)); //* forEach ile dizi içerisinde bulunan her bir elemanı dönüp her bir öğeyi listeden kaldırdık.
  }

  displayAlert("Liste Boş", "danger");
  localStorage.removeItem("list");
};
//* Yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};
//* Yerel depodan öğeleri alma işlemi
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("List"))
    : [];
}
//* Yerel depodan idsine göre silme işlemi
const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStore = (id, value) => {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

//* Gönderilen id ve value(değer) sahip bir öğe oluşturan fonksiyon
const createListItem = (id, value) => {
  const element = document.createElement("article"); //* Yeni bir "article" öğesi oluştur.
  let attr = document.createAttribute("data-id"); //* Yeni bir veri kimliği oluştur.
  attr.value = id;
  element.setAttributeNode(attr); //* Oluşturduğumuz idyi data özellik olarak set ettik.
  element.classList.add("grocery-item"); //* article etiketine class ekledik.

  element.innerHTML = `
      <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>  
    `;
  //* Oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik.
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  list.appendChild(element); //* Oluştuğumuz "article" etiketini htmle ekledik.
};

const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};

//! Olay İzleyicileri

//* Form gönderildiğinde addItem fonksiyonu çalışır.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
