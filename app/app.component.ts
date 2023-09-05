import { Component } from '@angular/core';
import { COMERCIALDATA } from '../mocks/commercialData';
import { SHOPPINGCART } from '../mocks/shoppingCart';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {}
  public ngOnInit(): void {
    this.getListCentrex();
  }
  public mapCentrexList;
  public mapCentrex = { dataCentrex: [] };
  getListCentrex() {
    const commercialData: any = COMERCIALDATA;
    const test = commercialData.find((e) =>
      e.rates.find((s) => s.lineCentrex.listSVACentrex.length)
    );
    this.mapCentrexList = test.rates[0].lineCentrex;
    console.log('this.mapCentrexList', this.mapCentrexList);
    this.getMapArrayCentrex();
  }

  arrayLineCentreMovil(arrayLineCentrexMovil, idLine) {
    arrayLineCentrexMovil.push({
      params: { siebelId: idLine },
      svas: this.getSvaOfShoppingCart(idLine, true),
    });
  }
  getMapArrayCentrex() {
    const arrayLineCentrexFijo: any = this.groupById(
      this.arrayLineCentrex(this.mapCentrexList.arrayLineCentrexFijoSelect)
    );

    let arrayLineCentrexMovil: any[] = [];
    this.arrayLineCentreMovil(arrayLineCentrexMovil, '1-2VX9EJ-1');
    this.arrayLineCentreMovil(arrayLineCentrexMovil, '1-2VX9F1-1');

    const arrayLineCentrexMovilTerceros: any = this.groupById(
      this.arrayLineCentrex(
        this.mapCentrexList.arrayLineCentrexMovilTercerosSelect
      )
    );

    if (this.mapCentrexList.selectedSwitch) {
      const groupCentralita = this.groupById([{ id: '1-2VENTG-1' }]);
      this.mapCentrex.dataCentrex = arrayLineCentrexFijo.concat(
        arrayLineCentrexMovil,
        arrayLineCentrexMovilTerceros,
        groupCentralita
      );
      console.log(this.mapCentrex.dataCentrex);
    } else {
      this.mapCentrex.dataCentrex = arrayLineCentrexFijo.concat(
        arrayLineCentrexMovil,
        arrayLineCentrexMovilTerceros
      );
    }
  }

  groupById(array: any[]) {
    const vm = this;
    let foundItem = { params: '', svas: [] };
    return array.reduce((acc, current) => {
      foundItem = acc.find((it) => it?.params?.siebelId === current.id);
      if (foundItem) {
        foundItem.svas.push(vm.getSvaOfShoppingCart(current.id));
      } else {
        acc.push({
          params: { siebelId: current.id },
          svas: [vm.getSvaOfShoppingCart(current.id)],
        });
      }
      return acc;
    }, []);
  }
  arrayLineCentrex(listCentrex) {
    return listCentrex
      .filter((e) => {
        return e?.line?.title;
      })
      .map((e) => e.line);
  }

  getSvaOfShoppingCart(idSva: string, isAgrup?: boolean) {
    const shoppingCart: any = SHOPPINGCART;
    if (shoppingCart && idSva) {
      let sva: any[] | any = [];

      shoppingCart.cartItem.forEach((cartItem1Level) => {
        cartItem1Level.cartItem.filter((cartItem2Level) => {
          try {
            if (
              cartItem2Level !== undefined &&
              cartItem2Level.id !== undefined
            ) {
              const isIdLevel: string = cartItem2Level.id.split('-')[1];
              if (isIdLevel === idSva.split('-')[1]) {
                if (isAgrup) {
                  sva.push(cartItem2Level);
                } else {
                  sva = cartItem2Level;
                }
              }
            }
          } catch {}
        });
      });
      return sva;
    }
  }
}
