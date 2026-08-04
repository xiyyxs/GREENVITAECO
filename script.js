document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-item[href^="#"], .logo[href^="#"]');
    const header = document.getElementById('header');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 10;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const notice = document.getElementById('formNotice');

    const BOT_TOKEN = '8848280410:AAErh3JXfiIJenShBEFGbo6E-_ArfgTRcAQ';
    const CHAT_ID = '-5101225958';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const city = document.getElementById('city').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const category = document.getElementById('category').value.trim() || 'Не указано';
        const comment = document.getElementById('comment').value.trim() || '—';

        if (!name || !age || !city || !contact) {
            showNotice('Пожалуйста, заполните все обязательные поля.', 'error');
            return;
        }

        const text = `Новая заявка с сайта GREENVITAECO\n\n` +
                     `Имя: ${name}\n` +
                     `Возраст: ${age}\n` +
                     `Город: ${city}\n` +
                     `Контакты: ${contact}\n` +
                     `Направление: ${category}\n` +
                     `Комментарий: ${comment}`;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Отправка...</span>';

        try {
            if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
                await new Promise(r => setTimeout(r, 600));
                showNotice('Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
            } else {
                const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: text
                    })
                });

                const data = await response.json();
                if (data.ok) {
                    showNotice('Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                    form.reset();
                } else {
                    throw new Error(data.description || 'Ошибка');
                }
            }
        } catch (err) {
            showNotice('Не удалось отправить заявку. Попробуйте еще раз или свяжитесь с нами напрямую.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Отправить заявку</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        }
    });

    function showNotice(message, type) {
        notice.textContent = message;
        notice.className = `form-notice ${type}`;
    }
});
