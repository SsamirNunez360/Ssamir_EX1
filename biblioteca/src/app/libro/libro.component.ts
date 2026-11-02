import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-libro',
  styleUrl: './libro.component.css',
  templateUrl: './libro.component.html',
})
export class LibroComponent implements OnInit {
  libros: any[] = [];
  libro = { codigo: '', titulo: '', autor: '', anio: null as number | null };
  error = '';
  editandoId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionBiblioteca')) {
      this.router.navigate(['/login']);
      return;
    }
    this.libros = JSON.parse(localStorage.getItem('librosBiblioteca') || '[]');
  }

  guardar() {
    if (!this.validar()) return;
    if (this.editandoId === null) {
      const id = this.libros.length ? Math.max(...this.libros.map(l => l.id)) + 1 : 1;
      this.libros.push({ id, ...this.libro });
    } else {
      const i = this.libros.findIndex(l => l.id === this.editandoId);
      this.libros[i] = { id: this.editandoId, ...this.libro };
    }
    this.persistir();
    this.cancelar();
  }



  cancelar() {
    this.editandoId = null;
    this.limpiar();
  }


  validar(): boolean {
    if (!this.libro.codigo.trim() || !this.libro.titulo.trim() || !this.libro.autor.trim()) {
      this.error = 'Código, título y autor son obligatorios';
      return false;
    }
    const a = Number(this.libro.anio);
    if (this.libro.anio === null || !Number.isInteger(a) || a < 1000 || a > 9999) {
      this.error = 'El año debe ser un entero de 4 cifras';
      return false;
    }
    this.error = '';
    return true;
  }

  persistir() {
    localStorage.setItem('librosBiblioteca', JSON.stringify(this.libros));
  }

  limpiar() {
    this.libro = { codigo: '', titulo: '', autor: '', anio: null };
    this.error = '';
  }

  cerrarSesion() {
    localStorage.removeItem('sesionBiblioteca');
    this.router.navigate(['/login']);
  }
}