document.addEventListener('DOMContentLoaded', function() {
    const getJokeBtn = document.getElementById('get-joke-btn');
    const jokeContent = document.getElementById('joke-content');
    const anyCategoryCheckbox = document.getElementById('any-category');
    const otherCategoryCheckboxes = document.querySelectorAll('#joke-categories input[type="checkbox"]:not(#any-category)');
    const vamorivamori = document.getElementById('vamorivamori');
    
    anyCategoryCheckbox.addEventListener('change', function() {
        if (this.checked) {
            otherCategoryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.closest('label').classList.add('disabled');
            });
        } else {
            otherCategoryCheckboxes.forEach(checkbox => {
                checkbox.closest('label').classList.remove('disabled');
            });
        }
    });
    
    otherCategoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                anyCategoryCheckbox.checked = false;
                anyCategoryCheckbox.closest('label').classList.remove('disabled');
            }
        });
    });
    

    anyCategoryCheckbox.dispatchEvent(new Event('change'));
    
    getJokeBtn.addEventListener('click', function() {
        fetchJoke();
        window.scrollTo({
            top: jokeContent.offsetTop - 200,
            behavior: 'smooth'
        });
    });
    
    async function fetchJoke() {

        jokeContent.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Carregando piada...</p>
            </div>
        `;
        
        try {
            
            let categories;
            if (anyCategoryCheckbox.checked) {
                categories = 'Any';
            } else {
                const categoryCheckboxes = document.querySelectorAll('#joke-categories input[type="checkbox"]:checked');
                categories = Array.from(categoryCheckboxes).map(cb => cb.value).join(',');
                
                
                if (categories === '') {
                    categories = 'Any';
                }
            }
            
        
            const jokeFormat = document.querySelector('input[name="joke_format"]:checked').value;
            
            
            const language = document.getElementById('language-select').value;
            
            
            const blacklistCheckboxes = document.querySelectorAll('#blacklist-options input[type="checkbox"]:checked');
            const blacklistFlags = Array.from(blacklistCheckboxes).map(cb => cb.value).join(',');
            
           
            let apiUrl = `https://v2.jokeapi.dev/joke/${categories}?lang=${language}`;
            
            
            if (jokeFormat !== 'any') {
                apiUrl += `&type=${jokeFormat}`;
            }
            
            if (blacklistFlags) {
                apiUrl += `&blacklistFlags=${blacklistFlags}`;
            }
            
           
            const response = await fetch(apiUrl);
            const data = await response.json();
            
           
            if (data.error) {
                jokeContent.innerHTML = `<p class="error">Erro: ${data.message}</p>`;
                return;
            }
            
          
            jokeContent.innerHTML = '';
            
            if (data.type === 'twopart') {
                jokeContent.innerHTML = `
                    <p class="setup">${data.setup}</p>
                    <p class="delivery" id="delivery-text">${data.delivery}</p>
                `;
                
                
                setTimeout(() => {
                    const deliveryElement = document.getElementById('delivery-text');
                    deliveryElement.classList.add('show');
                    
                    vamorivamori.currentTime = 0;
                    vamorivamori.play();
                }, 5000);
            } else {
                jokeContent.innerHTML = `<p class="single-joke">${data.joke}</p>`;
                
                
                vamorivamori.currentTime = 0;
                vamorivamori.play();
            }
            
        } catch (error) {
            jokeContent.innerHTML = `<p class="error">Ocorreu um erro ao buscar a piada: ${error.message}</p>`;
            console.error('Error fetching joke:', error);
        }
    }
    
});
