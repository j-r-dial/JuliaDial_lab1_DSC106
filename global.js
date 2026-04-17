console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');

const BASE_PATH =
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                 
    : "/JuliaDial_lab1_DSC106/";  

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'Resume/', title: 'Resume' },
    {url: 'https://github.com/j-r-dial', title: "Profile"}

];
  
let nav = document.createElement('nav');
document.body.prepend(nav);


for (let p of pages) {
    let url = p.url;
  
    url = !url.startsWith("http") ? BASE_PATH + url : url;
  
    let title = p.title;
  
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
        );

    if (a.host !== location.host) {
            a.target = "_blank";
    }
}

const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
const autoLabel = `Automatic (${isDark ? "Dark" : "Light"})`;

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">${autoLabel}</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

const select = document.querySelector('.color-scheme select');

if ("colorScheme" in localStorage){
    const saved = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', saved);
    select.value = saved;
}

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);

    const value = event.target.value;

    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value

  });

  const form = document.querySelector('form');

  form?.addEventListener('submit', function (event) {
    event.preventDefault(); 
  
    const data = new FormData(form);
  
    let url = form.action + "?"; 
  
    let params = [];
  
    for (let [name, value] of data) {
      const encodedValue = encodeURIComponent(value);
      params.push(`${name}=${encodedValue}`);
    }
  
    url += params.join("&");
  
    console.log(url);
  
    location.href = url; 
  });
