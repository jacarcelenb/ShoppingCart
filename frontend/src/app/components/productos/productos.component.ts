import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelProductos } from 'src/app/model/model.productos';
import { ModelCategoria } from 'src/app/model/model.categoria';
import { ProductoService } from 'src/app/service/productos.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from 'src/app/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: ModelProductos[] = [];
  categorias: ModelCategoria[] = [];
  public idCategoria!: number;
  public descripcionCategoria!: String
  resultado!: string;
  public pro_categorias: String[] = ["Ropa", "Electrodomesticos",
    "Accesorios", "Aseo Personal", "Tecnologia", "Limpieza"];

  public form!: FormGroup;
  pro: string = 'Anillo';
  nombreProducto: string = '';
  page: number = 0;
  id_producto: any
  imagen_producto: string = "";
  imagen_update: string = "";

  public informacionProducto = {
    pro_id: -1,
    pro_codigo: "",
    cat_id: -1,
    cat_descripcion: "",
    pro_nombres: "",
    pro_descripcion: "",
    pro_cantidad: "",
    pro_precio: "",
    pro_imagen: ""
  }

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private productoService: ProductoService, private storageService: StorageService) {

  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      txtpro_id: ['',[Validators.required]],
      txtpro_nombres: ['',[Validators.required, Validators.minLength(3),Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      txtcantidad: ['',[Validators.required]],
      txtpro_codigo: ['',[Validators.required]],
      txtpro_cantidad: ['',[Validators.required,Validators.pattern('/^[1-9]\d{6,10}$/')]],
      txtpro_descripcion: ['',[Validators.required, Validators.minLength(5)]],
      txtpro_precio: ['',[Validators.required,Validators.pattern('/^[1-9]\d{6,10}$/')]],
      categoriaSelected: [,[Validators.required]],
      txtpro_imagen: ['',[Validators.required]]
    })
    this.leerProductos();
    this.submit();
  }

  submit() {
    if (this.form.valid)
      this.resultado = "Todos los datos son válidos";
    else
      this.resultado = "Hay datos inválidos en el formulario";
  }

  public nextPage() {
    this.page += 5;
  }

  public previousPage() {
    if (this.page > 0)
      this.page -= 5;
  }

  showcategory(category: string): number {
    let id = 0

    if (category === 'Ropa') {
      id = 2
    }
    if (category === "Electrodomesticos") {
      id = 3
    }
    if (category === "Accesorios") {
      id = 4
    }
    if (category === "Aseo Personal") {
      id = 5
    }
    if (category === "Tecnologia") {
      id = 6
    }
    if (category === "Limpieza") {
      id = 8
    }
    console.log(category.length)
    console.log(id)
    return id
  }

  showCategoyById(id: number): string {
    let category = ""
    if (id == 2) {
      category = "Ropa"
    }
    if (id == 3) {
      category = "Electrodomesticos"
    }
    if (id == 4) {
      category = "Accesorios"
    }
    if (id == 5) {
      category = "Aseo Personal"
    }
    if (id == 6) {
      category = "Tecnologia"
    }
    if (id == 8) {
      category = "Limpieza"
    }
    return category
  }

  public leerProductos() {
    this.productoService.getProduct().subscribe(
      (producto: any) => {
        this.productos = producto
        console.log(this.productos)
      },
      (error) => console.warn(error)
    )
  }

  public cargarImagen(event: any) {
    let archivo = event.target.files
    let reader = new FileReader();
    let nombre = "img"
    let fecha = Date.now()
    reader.readAsDataURL(archivo[0])
    reader.onloadend = () => {
      this.storageService.subirImagen(nombre + "" + fecha, reader.result).then(urlImagen => {
        console.log(urlImagen)
        this.imagen_producto = String(urlImagen)
      })
    }

  }

  public leerPedidosByName() {
    this.productoService.getProductByName(this.pro).subscribe(
      (producto: any) => {
        this.productos = producto
        console.log(this.productos)
      },
      (error) => console.warn(error)
    )
  }


  validateNames(namesPer: string) {
    var expr: RegExp = /^([A-Za.-zÑñÁáÉéÍíÓóÚú]+[0-9]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+)(\s+([A-Za-zÑñÁáÉéÍíÓóÚú]+['\-]{0,1}[A-Za-zÑñÁáÉéÍíÓóÚú]+))*$/g;
    var verification = expr.test(namesPer);
    return verification;
  }

  validateMail(mail: string) {
    var expr: RegExp = /^([da-z_.-]+)@([da-z.-]+).([a-z.]{2,6})$/;
    var verification = expr.test(mail);
    return verification;
  }

  productPost() {
    console.log(this.informacionProducto)
    // utilizar try catch
    try {
      let warningCode = document.getElementById('valueCode')!;
      let warningNames = document.getElementById('valueNames')!;
      let warningDescription = document.getElementById('valueDescription')!;
      let warningCategory = document.getElementById('valueCategory')!;
      let warningAmount = document.getElementById('valueAmount')!;
      let warningImage = document.getElementById('valueImage')!;
      let warningCost = document.getElementById('valueCost')!;


      let comprobación = true;

      if (this.informacionProducto.pro_codigo == '') {
        warningCode.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese el codigo del producto.";
        warningCode.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateNames(this.informacionProducto.pro_codigo)) {
          warningCode.style.display = 'none';
        } else {
          warningCode.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese un codigo producto correcto.";
          warningCode.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.informacionProducto.pro_nombres == '') {
        warningNames.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese nombre producto.";
        warningNames.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateNames(this.informacionProducto.pro_nombres)) {
          warningNames.style.display = 'none';
        } else {
          warningNames.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese un nombre producto correcto.";
          warningNames.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.informacionProducto.pro_descripcion == '') {
        warningDescription.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese descripcion producto.";
        warningDescription.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateNames(this.informacionProducto.pro_descripcion)) {
          warningDescription.style.display = 'none';
        } else {
          warningDescription.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese una descripcion producto correcto.";
          warningDescription.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.informacionProducto.cat_descripcion == 'Categoria' || this.informacionProducto.cat_descripcion == '') {
        warningCategory.style.display = 'block';
        comprobación = false;
      } else {
        warningCategory.style.display = 'none';
      }

      if (this.informacionProducto.pro_cantidad == '') {
        warningAmount.style.display = 'block';
        comprobación = false;
      } else {
        warningAmount.style.display = 'none';
      }
      if (this.informacionProducto.pro_imagen == '') {
        warningImage.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese imagen producto.";
        warningImage.style.display = 'block';
        comprobación = false;
      } else {
        if (this.validateNames(this.informacionProducto.pro_imagen)) {
          warningImage.style.display = 'none';
        } else {
          warningImage.innerHTML = "<i class='fas fa-info-circle'></i> Ingrese una imagen producto correcto.";
          warningImage.style.display = 'block';
          comprobación = false;
        }
      }

      if (this.informacionProducto.pro_precio == '') {
        warningCost.style.display = 'block';
        comprobación = false;
      } else {
        warningCost.style.display = 'none';
      }

      if (comprobación) {
        // this.clienteService.postClients(this.clienteData).subscribe((data: {}) => { })
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Su registro ha sido exitoso',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Revise si los datos ingresados son correctos.',
          showConfirmButton: false,
          timer: 2000
        })
      }


    } catch (error) {
      console.log(error);

      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Su registro ha fallado',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  public postProduct() {
    this.productoService.postCreateProduct({
      codigo_prod: this.form.value.txtpro_codigo,
      cat_id: this.showcategory(this.form.value.categoriaSelected),
      pro_nombre: this.form.value.txtpro_nombres,
      pro_descripcion: this.form.value.txtpro_descripcion,
      pro_cantidad: this.form.value.txtcantidad,
      pro_precio: this.form.value.txtpro_precio,
      pro_imagen: this.imagen_producto,
      pro_estado: true
    }).subscribe(
      respuesta => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Producto creado correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        this.form.reset();
        this.leerProductos();
        this.submit();
      }
    )
  }

  public infoUpdateProducto(producto: any) {
    this.id_producto = producto.pro_id;
    this.form.controls["txtpro_codigo"].setValue(producto.codigo_prod)
    this.form.controls["txtpro_nombres"].setValue(producto.pro_nombre)
    this.form.controls["txtpro_descripcion"].setValue(producto.pro_descripcion)
    this.form.controls["categoriaSelected"].setValue(this.showCategoyById(producto.cat_id))
    this.form.controls["txtcantidad"].setValue(producto.pro_cantidad)
    this.form.controls["txtpro_precio"].setValue(producto.pro_precio)
    this.form.controls["txtpro_imagen"].disable();
    this.form.controls["txtpro_imagen"].setValue(producto.pro_imagen)
    this.imagen_update = producto.pro_imagen
    console.log(this.id_producto)

  }


  public actualizarProducto() {
    // si no actualiza la imagen
    let fecha = new Date();
    console.log(fecha.getSeconds());
    console.log(this.imagen_producto)
    if (this.imagen_producto == "") {
      this.imagen_producto = this.imagen_update
    }
    this.productoService.putUpdateProduct(this.id_producto,
      {
        pro_id: this.id_producto,
        codigo_prod: this.form.value.txtpro_codigo,
        cat_id: this.showcategory(this.form.value.categoriaSelected),
        pro_nombre: this.form.value.txtpro_nombres,
        pro_descripcion: this.form.value.txtpro_descripcion,
        pro_cantidad: this.form.value.txtcantidad,
        pro_estado: true,
        pro_precio: this.form.value.txtpro_precio,
        pro_imagen: this.imagen_producto,

      }).subscribe(
        respuesta => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          this.form.reset()
          this.leerProductos()

        }
      )
  }

  public deleteProducto(pro_id: any) {

    Swal.fire({
      title: 'Está seguro de eliminar al siguiente producto?',
      text: "El producto ya no se verá en el listado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProduct(pro_id,
          {
            pro_id: pro_id,
            pro_codigo: this.form.value.txtpro_codigo,
            cat_id: this.form.value.categoriaSelected,
            pro_nombres: this.form.value.txtpro_nombre,
            pro_descripcion: this.form.value.txtpro_descripcion,
            pro_cantidad: this.form.value.cantidadSelected,
            pro_precio: this.form.value.txtpro_precio,
            pro_imagen: this.imagen_producto,

          }).subscribe(
            respuesta => {
              this.form.reset()
              this.leerProductos()

            }
          )

        Swal.fire(
          'Eliminado!',
          'Producto borrado.',
          'success'
        )
      }
    })


  }

}
