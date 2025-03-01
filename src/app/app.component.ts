import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [ ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LandingForms';
  contactForm: FormGroup;
  private scriptUrl = "https://script.google.com/macros/s/AKfycbxXyx4dOsrhagg_ZEZdY457VKBxpn4XJa7ed47k0kf_LNV0v5F5Vr3IR3Y93wWKcviObQ/exec"; // Reemplaza con la URL de tu script de Google Apps Script

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      npersonas: [''],
      fecha: ['']
    });
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
          alert('Formulario enviado correctamente.');
          this.contactForm.reset();
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
}
