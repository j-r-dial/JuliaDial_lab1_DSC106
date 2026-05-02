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

    const normalize = (path) => path.replace(/\/$/, "");

    a.classList.toggle(
      'current',
      a.host === location.host &&
      normalize(a.pathname) === normalize(location.pathname)
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
        <option value="light dark">Automatic</option>
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

  export async function fetchJSON(url) {
    try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }
  }

  export function renderProjects(project, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';

    for (let i=0; i < project.length; i+=1){
      const current = project[i]
      const article = document.createElement('article');
      const isExternal = current.image.startsWith('https://');
      const imageSrc = isExternal
        ? current.image
        : BASE_PATH + current.image;
      
        article.innerHTML = `
        <${headingLevel}>${current.title}</${headingLevel}>
        
        <img src="${imageSrc}" alt="${current.title}">
        
        <div class="project-text">
          <p>${current.description}</p>
          <p class="project-year">${current.year}</p>
        </div>
      `;
  
      containerElement.appendChild(article);
      console.log(current.image, imageSrc);
    }
  }

  export async function fetchGitHubData(username) {
    
    return fetchJSON(`https://api.github.com/users/${username}`);
  }

  
