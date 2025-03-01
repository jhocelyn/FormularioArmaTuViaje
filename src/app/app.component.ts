import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgClass, NgIf, NgForOf, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'LandingForms';
  images = [
    { src: 'assets/Punta-cana-hero.webp', alt: 'Vista de Punta Cana con playa y mar', width: 800 },
    { src: 'assets/Punta-cana-hero2.jpg', alt: 'Playa paradisíaca en Cancún', width: 400 },
    { src: 'assets/Punta-cana-hero3.jpeg', alt: 'Atardecer en Bali con templos', width: 600 },
    { src: 'assets/Punta-cana-hero.webp', alt: 'Vista de Punta Cana con playa y mar', width: 200 },
    { src: 'assets/Punta-cana-hero.webp', alt: 'Vista de Punta Cana con playa y mar', width: 800 }
  ];

  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;
  duplicateImages: any[] = [];
  translateX = 0;
  currentIndex = 0;
  transitionEnabled = true;

  ngAfterViewInit() {
    this.setupCarousel();
  }

  setupCarousel() {
    // Duplicamos imágenes para el efecto infinito
    this.duplicateImages = [
      ...this.images.slice(-2), // Últimas 2 imágenes al inicio
      ...this.images,
      ...this.images.slice(0, 2) // Primeras 2 imágenes al final
    ];

    // Ajustamos la posición inicial para que empiece en la imagen real
    setTimeout(() => {
      this.translateX = -this.duplicateImages[2].width;
    });
  }

  next() {
    if (!this.transitionEnabled) return;

    this.transitionEnabled = true;
    this.translateX -= this.duplicateImages[this.currentIndex + 2].width;
    this.currentIndex++;

    if (this.currentIndex >= this.images.length) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentIndex = 0;
        this.translateX = -this.duplicateImages[2].width;
        setTimeout(() => this.transitionEnabled = true, 50); // Reactivar transición
      }, 500);
    }
  }

  prev() {
    if (!this.transitionEnabled) return;

    this.transitionEnabled = true;
    this.translateX += this.duplicateImages[this.currentIndex + 1].width;
    this.currentIndex--;

    if (this.currentIndex < 0) {
      setTimeout(() => {
        this.transitionEnabled = false;
        this.currentIndex = this.images.length - 1;
        this.translateX = -this.duplicateImages[this.currentIndex + 2].width;
        setTimeout(() => this.transitionEnabled = true, 50); // Reactivar transición
      }, 500);
    }
  }

  contactForm: FormGroup;
  formSubmitted = false; // Estado para mostrar el mensaje de agradecimiento
  private scriptUrl = "https://script.google.com/macros/s/AKfycbwAo0wqHVv5XfA0xDKJB4eYXvmAWv80TCuzYd-0GSno3eg5F3IT7CllPPjC-CMZU87A/exec"; // Reemplaza con la URL de tu script de Google Apps Script
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['',[Validators.required,Validators.minLength(3)]],
      email: ['',[Validators.required,Validators.email]],
      phone: ['',[Validators.required,Validators.pattern('^[0-9]{9,10}$')]],
      npersonas: ['',[Validators.required,Validators.min(1)]],
      fecha: ['',[Validators.required]]
    });
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000); // Cambia de imagen cada 4 segundos

  }
  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Formulario enviado:', formData);
      // Cambia esta URL por la de tu Apps Script o API
      const url = this.scriptUrl;
      // Configurar los encabezados de la solicitud
      const headers = {
        'Content-Type': 'text/plain;charset=utf-8'
      };

      // Usamos fetch para enviar la solicitud POST
      fetch(url, {
        redirect:'follow',
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData) // Convertir formData a JSON
      })
        .then((response) => response.json()) // Parsear la respuesta
        .then((data) => {
          console.log('Datos enviados correctamente:', data);
          this.contactForm.reset();
          this.formSubmitted = true; // Cambia el estado para mostrar el mensaje
        })
        .catch((error) => {
          console.error('Error al enviar los datos:', error);
          alert('Ocurrió un error al enviar el formulario.');
        });
    }
    else {
      alert("Por favor, completa todos los campos.");
    }
  }
  campoInvalido(campo: string): boolean {
    const control = this.contactForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
