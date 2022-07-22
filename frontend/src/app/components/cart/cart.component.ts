import { Component, Input, OnInit } from '@angular/core';
import { ModelPedidoDetalle } from 'src/app/model/model.pedido-detalle';
import { CartService } from 'src/app/service/cart.service';
import { ClientesService } from 'src/app/service/clientes.service';
import { PedidosService } from 'src/app/service/pedidos.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductoService } from 'src/app/service/productos.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @Input() quantity = { value: 1 }
  nombre: string = '';
  descripcion: string = '';
  iva: number = 0.12;
  subtotal: number = 0;
  mostrar: boolean = false;
  total: number = 0;
  cliente: any = [];
  cabecera: any = [];
  cabeceras: any = [];
  id_cabeceras: any = [];
  num_cabecera: any;
  ped_cabecera: number = 0;
  detalles: ModelPedidoDetalle[] = [];
  detail!: ModelPedidoDetalle;
  stock_productos: any =[];
  stock: number=0;
  producto = {
    pro_id: 0,
    cat_id: 0,
    pro_nombre: "",
    pro_descripcion: "",
    pro_cantidad: 0,
    pro_precio: 0,
    pro_estado: false,
    codigo_prod: "",
    pro_imagen: ""

  }

  pedidoCabecera = {
    per_id: 0,
    ped_cab_codigo: "",
    ped_cab_fecha: "",
    ped_cab_subtotal: 0,
    ped_cab_iva: 0,
    ped_cab_total: 0,
  }

  pedidoDetalle = {
    pro_id: 0,
    ped_cab_id: 0,
    ped_det_cant: 0,
    ped_det_unitario: 0,
    ped_det_total: 0
  }
  public product: any = [];
  public detalle: any = [];
  public selectProduct: any = [];
  public newProduct: any = [];
  public productLast: any = [];
  public grandTotal: number = 0;
  constructor(private cartService: CartService,
    private pedidoService: PedidosService, private clienteService: ClientesService
    ,private router: Router,private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cartService.getProducts()
      .subscribe(res => {
        this.product = res;

        this.productLast = this.product[this.product.length - 1]
      })

    this.FindClient();
    this.GetHeaders();

  }

  public FindClient() {
    this.clienteService.getClientsByCedula(String(localStorage.getItem('per_cedula'))).subscribe(
      (persona: any) => {
        this.cliente = persona
        console.log(this.cliente)
      },
      (error) => console.warn(error)
    )
  }

  public GetHeaders() {
    this.pedidoService.getOrderHeaders().subscribe(
      (header: any) => {
        this.cabeceras = header
        console.log(this.cabeceras.length)
        this.num_cabecera = this.cabeceras.length
      },
      (error) => console.warn(error)
    )
  }




  showProducts(): void {
    this.mostrar = (this.mostrar == true) ? false : true
  }

  addProduct() {
    this.producto.pro_nombre = this.productLast.pro_nombre
    this.producto.pro_id = this.productLast.pro_id
    this.producto.cat_id = this.productLast.cat_id
    this.producto.pro_descripcion = this.productLast.pro_descripcion
    this.producto.pro_cantidad = this.productLast.pro_cantidad
    this.producto.pro_estado = this.productLast.pro_estado
    this.producto.codigo_prod = this.productLast.codigo_prod
    this.producto.pro_imagen = this.productLast.pro_imagen
   

    if (this.producto.pro_cantidad < this.quantity.value) {

      Swal.fire({
        icon: 'warning',
        title: 'Ha excedido la cantidad del producto',
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      for (let index = 0; index < this.product.length; index++) {
      
        if (this.product[index].pro_id === this.producto.pro_id) {
         
          this.product[index].quantity = this.quantity.value;
        }
        this.selectProduct.push(this.product[index])
      }
      console.log(this.selectProduct)
      this.subtotal = this.getTotal()
      this.total = (this.subtotal * this.iva) + this.subtotal;



      Swal.fire({
        icon: 'info',
        title: 'Producto añadido correctamente',
        showConfirmButton: false,
        timer: 1500
      })
      this.showProducts()
    }

   
  }



  removeItem(item: any) {
    let pos = 0;
    Swal.fire({
      title: '¿Está seguro de eliminar este producto?',
      text: "No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        for (let index = 0; index < this.selectProduct.length; index++) {
          if (this.selectProduct[index].pro_id == item.pro_id) {
            this.selectProduct.splice(index, 1)
          }

        }

        this.cartService.removeCartItem(item)
        this.productLast = undefined
        this.quantity.value = 0

        this.subtotal = this.getTotal()
        this.total = (this.subtotal * this.iva) + this.subtotal;
        Swal.fire(
          'Eliminado!',
          'El producto sea eliminado de su carrito.',
          'success'
        )
      }
    })

  }

  getTotal(): number {
    let total = 0
    for (let index = 0; index < this.selectProduct.length; index++) {

      total += this.selectProduct[index].quantity * this.selectProduct[index].pro_precio;

    }
    return parseFloat(total.toFixed(2));
  }

  dateToYMD(date: Date): string {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }

  createPedido() {
    console.log(this.stock)
    Swal.fire({
      title: '¿Está seguro de realizar este pedido?',
      text: "No podrá revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.pedidoCabecera.per_id = this.cliente[0].per_id;
          this.pedidoCabecera.ped_cab_codigo = "PC000PEF" + (this.num_cabecera + 2);
          this.pedidoCabecera.ped_cab_iva = this.iva;
          this.pedidoCabecera.ped_cab_subtotal = parseFloat(this.subtotal.toFixed(2));
          this.pedidoCabecera.ped_cab_total = parseFloat(this.total.toFixed(2));
          let fecha = new Date()
          console.log(fecha.getSeconds())
          this.pedidoCabecera.ped_cab_fecha = this.dateToYMD(fecha);
          console.log(this.pedidoCabecera)
          this.pedidoService.postOrderHeader(this.pedidoCabecera).subscribe((data: any) => {
            this.id_cabeceras = data
            console.log(this.id_cabeceras)
            let valor = 0
            this.ped_cabecera = this.id_cabeceras[0].ped_cab_id
            console.log(this.ped_cabecera)
            for (let index = 0; index < this.selectProduct.length; index++) {
              valor = this.selectProduct[index].quantity * this.selectProduct[index].pro_precio;
              this.pedidoDetalle.pro_id = this.selectProduct[index].pro_id
              this.pedidoDetalle.ped_cab_id = this.ped_cabecera;
              this.pedidoDetalle.ped_det_cant = this.selectProduct[index].quantity;
              this.pedidoDetalle.ped_det_unitario = this.selectProduct[index].pro_precio,
              this.pedidoDetalle.ped_det_total = parseFloat(valor.toFixed(2))

              console.log("Datos encontrados")
              console.log(this.pedidoDetalle.pro_id)
              console.log(this.pedidoDetalle.ped_det_unitario)
              console.log(this.pedidoDetalle.ped_det_cant)
              console.log(this.pedidoDetalle)

              // Actualizar el stock
              let cantidad = this.selectProduct[index].pro_cantidad - this.selectProduct[index].quantity;
              this.productoService.putUpdateStock(this.selectProduct[index].pro_id,{pro_cantidad: cantidad }).subscribe((data:any) => {
               console.log("producto "+this.selectProduct[index].pro_id + " cantidad "+ cantidad)
               console.log("")
              })

              this.pedidoService.postOrderDetail(this.pedidoDetalle).subscribe((data: {}) => {
               this.cartService.removeAllCart();
               this.selectProduct =[]
               this.subtotal = 0
               this.total = 0

              })
              Swal.fire(
                'Pedido creado correctamente!',
                'Revise la sección mis compras.',
                'success'
              )

            }


          })


        } catch (error) {
          Swal.fire(
            'No se logro realizar el pedido!',
            'Pedido no creado.',
            'warning'
          )
        }
      }
    })

  }


  vermisCompras(){
    this.cartService.removeAllCart();
    this.selectProduct =[]
    this.router.navigate(['/client-order-list']);
  }
}
