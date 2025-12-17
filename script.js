
let productosData = null;
let categoriaActual = 'todos';


setTimeout(() => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainCatalog = document.getElementById('main-catalog');

    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        mainCatalog.classList.remove('hidden');

        setTimeout(() => {
            mainCatalog.style.opacity = '1';
            mainCatalog.style.transform = 'translateY(0)';
            
            cargarProductos();
        }, 50);
    }, 800);
}, 4000);


async function cargarProductos() {
    try {
        mostrarCargando();
        const response = await fetch('productos.json');
        productosData = await response.json();
        
        renderizarCategorias();
        renderizarProductos(productosData.productos);
        configurarEventListeners();
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('Error al cargar los productos. Por favor, recarga la página.');
    }
}


function renderizarCategorias() {
    const navContainer = document.getElementById('catalog-nav');
    navContainer.innerHTML = '';
    
    productosData.categorias.forEach(categoria => {
        const btn = document.createElement('button');
        btn.className = `nav-btn ${categoria.activa ? 'active' : ''}`;
        btn.textContent = categoria.nombre;
        btn.setAttribute('data-categoria', categoria.id);
        navContainer.appendChild(btn);
    });
}

function renderizarProductos(productos) {
    const gridContainer = document.getElementById('products-grid');
    gridContainer.innerHTML = '';
    
    productos.forEach(producto => {
        if (categoriaActual === 'todos' || producto.categoria === categoriaActual) {
            const productCard = crearTarjetaProductoConModal(producto);
            gridContainer.appendChild(productCard);
        }
    });
    
    configurarBotonesCarrito();
}

function crearTarjetaProducto(producto) {
    const card = document.createElement('div');
    card.className = `product-card ${!producto.disponible ? 'product-unavailable' : ''}`;
    card.setAttribute('data-id', producto.id);
    
    card.innerHTML = `
        <div class="product-image">
            ${crearImagenProducto(producto)}
        </div>
        <h3 class="product-name">${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion}</p>
        <p class="product-price">$${producto.precio.toFixed(2)}</p>
        <button class="add-to-cart" ${!producto.disponible ? 'disabled' : ''}>
            ${producto.disponible ? '📱 Hacer Pedido' : 'No Disponible'}
        </button>
    `;
    
    return card;
}


function crearImagenProducto(producto) {
    return `
        <img src="${producto.imagen}" 
             alt="${producto.nombre}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
             loading="lazy">
        <div class="emoji-placeholder" style="display: none;">🎀</div>
    `;
}


function configurarEventListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const categoria = e.target.getAttribute('data-categoria');
            cambiarCategoria(categoria, e.target);
        });
    });
}


function configurarBotonesCarrito() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.disabled) return;
            
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.getAttribute('data-id'));
            const producto = productosData.productos.find(p => p.id === productId);
            
            if (producto) {
                agregarAlCarrito(producto, btn);
            }
        });
    });
}

function cambiarCategoria(nuevaCategoria, btnElement) {
    categoriaActual = nuevaCategoria;
    

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    btnElement.classList.add('active');

    filtrarProductos(nuevaCategoria);
}

function filtrarProductos(categoria) {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
    });
    
    setTimeout(() => {
        renderizarProductos(productosData.productos);
        
        setTimeout(() => {
            const newCards = document.querySelectorAll('.product-card');
            newCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 100);
            });
        }, 50);
    }, 200);
}

function agregarAlCarrito(producto, btnElement) {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    

    btnElement.style.background = '#10b981';
    btnElement.textContent = '✓ Ver contacto abajo';
    
    setTimeout(() => {
        btnElement.style.background = '';
        btnElement.textContent = 'Hacer Pedido';
    }, 2000);
    

    mostrarNotificacion(`¡Perfecto! Contáctanos por redes sociales para ordenar: ${producto.nombre}`);
    

    console.log('Producto seleccionado:', producto);
}


function mostrarCargando() {
    const gridContainer = document.getElementById('products-grid');
    gridContainer.innerHTML = '<div class="loading">Cargando productos...</div>';
}


function mostrarError(mensaje) {
    const gridContainer = document.getElementById('products-grid');
    gridContainer.innerHTML = `<div class="loading" style="color: #ef4444;">${mensaje}</div>`;
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = mensaje;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #6b46c1, #ec4899);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalClose = document.getElementById('modalClose');


function abrirModal(producto) {
    modalImage.src = producto.imagen;
    modalImage.alt = producto.nombre;
    modalName.textContent = producto.nombre;
    modalDescription.textContent = producto.descripcion;
    modalPrice.textContent = `$${producto.precio.toFixed(2)}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; 
}


modalClose.addEventListener('click', cerrarModal);


modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        cerrarModal();
    }
});


function crearTarjetaProductoConModal(producto) {
    const card = document.createElement('div');
    card.className = `product-card ${!producto.disponible ? 'product-unavailable' : ''}`;
    card.setAttribute('data-id', producto.id);
    
    card.innerHTML = `
        <div class="product-image" data-producto-id="${producto.id}">
            ${crearImagenProducto(producto)}
        </div>
        <h3 class="product-name">${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion}</p>
        <p class="product-price">$${producto.precio.toFixed(2)}</p>
        <button class="add-to-cart" ${!producto.disponible ? 'disabled' : ''}>
            ${producto.disponible ? 'Hacer Pedido' : 'No Disponible'}
        </button>
    `;
    

    const imageContainer = card.querySelector('.product-image');
    imageContainer.addEventListener('click', () => {
        abrirModal(producto);
    });
    
    return card;
}
