// Google Sheets API Configuration
// Ganti dengan URL Web App Anda setelah deploy Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNEUBQIN26MUEuetI0qj_hrj6zjMjyJt57O66TcSPHMmAhefYTF7X9nYnIuybgXt4/exec';

// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

// Form validation
function validateForm() {
    let isValid = true;
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validate Nama
    const nama = document.getElementById('nama').value.trim();
    if (!nama) {
        document.getElementById('nama-error').textContent = 'Nama lengkap wajib diisi';
        isValid = false;
    }
    
    // Validate Program
    const program = document.getElementById('program').value;
    if (!program) {
        document.getElementById('program-error').textContent = 'Program kursus wajib dipilih';
        isValid = false;
    }
    
    // Validate NIK
    const nik = document.getElementById('nik').value.trim();
    if (!nik) {
        document.getElementById('nik-error').textContent = 'NIK/NIS wajib diisi';
        isValid = false;
    } else if (!/^\d+$/.test(nik)) {
        document.getElementById('nik-error').textContent = 'NIK/NIS harus berupa angka';
        isValid = false;
    }
    
    // Validate Alamat
    const alamat = document.getElementById('alamat').value.trim();
    if (!alamat) {
        document.getElementById('alamat-error').textContent = 'Alamat wajib diisi';
        isValid = false;
    }
    
    // Validate WhatsApp
    const whatsapp = document.getElementById('whatsapp').value.trim();
    if (!whatsapp) {
        document.getElementById('whatsapp-error').textContent = 'Nomor WhatsApp wajib diisi';
        isValid = false;
    } else if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(whatsapp)) {
        document.getElementById('whatsapp-error').textContent = 'Format nomor WhatsApp tidak valid';
        isValid = false;
    }
    
    // Validate Agreement
    const agree = document.getElementById('agree').checked;
    if (!agree) {
        document.getElementById('agree-error').textContent = 'Anda harus menyetujui syarat dan ketentuan';
        isValid = false;
    }
    
    return isValid;
}

// Submit form to Google Sheets
async function submitToGoogleSheets(formData) {
    try {
        // Show loading state
        submitBtn.innerHTML = '<span>Mengirim...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Prepare data for Google Sheets
        const data = {
            timestamp: new Date().toLocaleString('id-ID'),
            nama: formData.get('nama'),
            program: formData.get('program'),
            kelas: formData.get('kelas') || 'Belum memilih',
            nik: formData.get('nik'),
            alamat: formData.get('alamat'),
            whatsapp: formData.get('whatsapp')
        };
        
        // Send data to Google Sheets via Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Since we're using no-cors, we can't check the response directly
        // Show success message
        showFormMessage('Pendaftaran berhasil! Data Anda telah terkirim. Kami akan menghubungi Anda via WhatsApp dalam 1x24 jam.', 'success');
        
        // Reset form
        registrationForm.reset();
        
        // Log to console for debugging
        console.log('Data sent to Google Sheets:', data);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showFormMessage('Terjadi kesalahan saat mengirim data. Silakan coba lagi atau hubungi kami langsung via WhatsApp.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = '<span>Daftar Sekarang</span><i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
    }
}

// Show form message
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message';
    formMessage.classList.add(type === 'success' ? 'success-message' : 'error-message');
    formMessage.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Form submission handler
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        showFormMessage('Silakan perbaiki kesalahan pada formulir di atas.', 'error');
        return;
    }
    
    const formData = new FormData(registrationForm);
    
    // For demo purposes, we'll simulate submission
    // In production, replace with actual Google Sheets integration
    if (SCRIPT_URL.includes('AKfycbwSx8f8mZ9TdLq7pJZvHqJpKpFvLk4YpQxqL8s9k9vLr4gJv8tQ')) {
        // This is a dummy script ID - show demo mode message
        showFormMessage('Pendaftaran berhasil! (Mode Demo: Data tidak dikirim ke Google Sheets. Silakan setup Google Apps Script untuk integrasi nyata)', 'success');
        
        // Log data to console for demo
        const data = {
            timestamp: new Date().toLocaleString('id-ID'),
            nama: formData.get('nama'),
            program: formData.get('program'),
            kelas: formData.get('kelas') || 'Belum memilih',
            nik: formData.get('nik'),
            alamat: formData.get('alamat'),
            whatsapp: formData.get('whatsapp')
        };
        console.log('Data yang akan dikirim ke Google Sheets:', data);
        
        // Reset form
        registrationForm.reset();
    } else {
        // Actual submission to Google Sheets
        await submitToGoogleSheets(formData);
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Formatted WhatsApp input
const whatsappInput = document.getElementById('whatsapp');
whatsappInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Convert to Indonesian format
    if (value.startsWith('0')) {
        value = '62' + value.substring(1);
    } else if (!value.startsWith('62')) {
        value = '62' + value;
    }
    
    e.target.value = value;
});

// Dropdown menu for mobile
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Tik Tak Top Course website loaded successfully!');
    
    // Set current year in footer if needed
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement && yearElement.textContent.includes('2023')) {
        yearElement.textContent = yearElement.textContent.replace('2023', new Date().getFullYear());
    }
});