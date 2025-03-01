import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LandingForms';
  contactForm: FormGroup;
  private scriptUrl = "https://script.google.com/macros/s/AKfycbwAo0wqHVv5XfA0xDKJB4eYXvmAWv80TCuzYd-0GSno3eg5F3IT7CllPPjC-CMZU87A/exec"; // Reemplaza con la URL de tu script de Google Apps Script

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['',[Validators.required,Validators.minLength(3)]],
      email: ['',[Validators.required,Validators.email]],
      phone: ['',[Validators.required,Validators.pattern('^[0-9]{9,10}$')]],
      npersonas: ['',[Validators.required,Validators.min(1)]],
      fecha: ['',[Validators.required]]
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
  campoInvalido(campo: string): boolean {
    const control = this.contactForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
