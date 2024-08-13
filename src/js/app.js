// Recuerda: DOMContentLoaded espera a que este listo todo el HTML y CSS

document.addEventListener('DOMContentLoaded', function() {
    navegacionFija();
    crearGaleria();
    resaltarEnlace();
    scrollNav();
});

function navegacionFija() {
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');

    window.addEventListener('scroll', function() {
        if (sobreFestival.getBoundingClientRect().bottom < 1) {
            //console.log('Ya lo pasaste :D');
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
}

function crearGaleria() {
    const CANTIDAD_IMAGENES = 16
    const galeria = document.querySelector('.galeria-imagenes');

    // Recorremos todas las imagenes de "src/img/gallery/full"
    for(let i = 1; i <= CANTIDAD_IMAGENES; i++) {

        // Cuando creamos elementos HTML desde JS se recomienda escribirlos con mayusculas. Ej: IMG
        const imagen = document
        .createElement('PICTURE');

        imagen.innerHTML = `
            <source srcset="build/img/gallery/thumb/${i}.avif" type="image/avif">
            <source srcset="build/img/gallery/thumb/${i}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="build/img/gallery/thumb/${i}.jpg" alt="imagen galeria">
        `;
        //imagen.loading = 'lazy';
        // Las dimensiones no necesariamente tienen que ser exactas, solo es un aproximado
        //imagen.width = '300';
        //imagen.height = '200';
        //imagen.src = `src/img/gallery/thumb/${i}.jpg`;
        //imagen.alt = 'Imagen galeria';
        
        // Event handler
        imagen.onclick = function() {
            mostrarImagen(i);            
        }


        // agregamos las imagenes
        galeria.appendChild(imagen)
        
    }
}

function mostrarImagen(i) {
    const imagen = document.createElement('PICTURE');

    imagen.innerHTML = `
        <source srcset="build/img/gallery/full/${i}.avif" type="image/avif">
        <source srcset="build/img/gallery/full/${i}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="build/img/gallery/full/${i}.jpg" alt="imagen galeria">
    `;
    //imagen.src = `src/img/gallery/full/${i}.jpg`;
    //imagen.alt = 'Imagen galeria';
    
    // Generar modal
    const modal = document.createElement('DIV');

    modal.classList.add('modal');
    modal.onclick = cerrarModal; //

    // Una vez que generamos el modal, agregamos el boton de cerrar modal

    const cerrarModalBtn = document.createElement('BUTTON');
    cerrarModalBtn.textContent = 'X';
    cerrarModalBtn.classList.add('btn-cerrar');

    cerrarModalBtn .onclick = cerrarModal;

    modal.appendChild(imagen);
    modal.appendChild(cerrarModalBtn);
    
    // Agregar al HTML
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden');
    body.appendChild(modal);
    
}

function cerrarModal() {
    const modal = document.querySelector('.modal');

    // Si existe "modal" entonces se elimina

    modal.classList.add('fade-out');

    setTimeout(() => {
        modal?.remove();
        const body = document.querySelector('body');
        body.classList.remove('overflow-hidden');
    }, 500)
    
}

function resaltarEnlace() {
    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navegacion-principal a');

        let actual = '';
        sections.forEach(section => {
            // offsetTop --> Toma la distancia entre la parte superior del "section" y su elemento padre
            const sectionTop = section.offsetTop;

            const sectionHeight = section.clientHeight;

            if(window.scrollY >= (sectionTop - sectionHeight / 3)) {
                actual = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if(link.getAttribute('href') === '#' + actual) {
                link.classList.add('active');
            }
        })
    });
}

function scrollNav() {
    const navLinks = document.querySelectorAll('.navegacion-principal a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const sectionScroll = e.target.getAttribute('href');

            const section = document.querySelector(sectionScroll);

            section.scrollIntoView({behavior: 'smooth'});
        })
    })
}