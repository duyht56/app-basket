import { useEffect, useState } from 'react';
import styles from '../../styles/modules/Basket.module.scss';

import { subscribe, publish } from '@/events';

const Basket = () => {
  const [hasVoucher, setHasVoucher] = useState(false);
  const [itemsCart, setItemsCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const addToCart = (item: any, isPlus: boolean) => {
    if (typeof localStorage !== 'undefined') {
      try {
        const cartItemsString = localStorage.getItem('cartItems');
        if (cartItemsString) {
          const cartItems = JSON.parse(cartItemsString);
          const itemIndex = cartItems.findIndex(
            i => i.productCode === item.productCode
          );

          if (itemIndex > -1) {
            if (isPlus) {
              cartItems[itemIndex].quantity += 1;
            } else {
              if (cartItems[itemIndex].quantity === 0) {
                cartItems.splice(itemIndex, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                publish('addToCart', cartItems[itemIndex]);
                return
              }
              cartItems[itemIndex].quantity -= 1;
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            publish('addToCart', cartItems[itemIndex]);
            return;
          }
        }
      } catch (e) {
        localStorage.removeItem('cartItems');
      }
    }
  };

  const caculatePrice = () => {
    const cartItemsString = localStorage.getItem('cartItems');
    if (cartItemsString) {
      const cartItems = JSON.parse(cartItemsString);
      let totalPrices = 0
      cartItems.forEach((element, index) => {
        try {
          const price = element.price.split(' ')[1].replace(',', '.');
          element.total = (+price * element.quantity).toFixed(2)
          totalPrices += +element.total
        } catch (error) {
          console.log('error caculatePrice')
        }
      });
      setTotalPrice(totalPrices)
      setItemsCart(cartItems);
    }
  }

  useEffect(() => {
    caculatePrice();
    subscribe('addToCart', () => {
      caculatePrice();
    });
  }, []);

  return (
    <div className={styles['CardContainer']}>
      <div className={styles['BasketContainer']}>
        <div className={styles['basket-table']}>
          <div className={styles['basket-table-header']}>
            <h1 className={styles['D2CBasket-pageTitle']}>Il tuo Carrello</h1>
            <div className={styles['D2CBasket-total']}>
              <div className={styles['D2CBasket-totalRow']}>
                <div className={styles['D2CBasket-totalKey']}>Totale:</div>
                <div className={styles['D2CBasket-totalValue']}>€ {totalPrice}</div>
              </div>
            </div>
          </div>
          <div className={styles['D2CBasket-basketPanel']}>
            <div className={styles['D2CBasket-itemsContainer']}>
              {itemsCart.map((item, indexx) => {
                return (
                  <div
                    id="925992289"
                    className={styles['D2CBasket-item']}
                    key={indexx}
                  >
                    <div className={styles['D2CBasket-itemRow']}>
                      <div className={styles['D2CBasket-itemColumn--image']}>
                        <a href="">
                          <img
                            src="https://www.electrolux.it/remote.jpg.ashx?urlb64=aHR0cHM6Ly9zZXJ2aWNlcy5lbGVjdHJvbHV4LW1lZGlhbGlicmFyeS5jb20vMTE4ZWQ0YzBlZTY1NDZmNGE3Njg0YzdmZWY4Yzk4NWFOclptWWtNODYxZDFmL3ZpZXcvV1NfUE4vUFNFUlJGMjEwUEUwMDAwMS5wbmc&amp;hmac=eTxW__nAuSo&amp;width=80&amp;quality=70&amp;format=png&amp;mode=crop"
                            alt="Frigocongelatore REX® Retrò Serie 600 TwinTech® Total No Frost 175.1 cm"
                            className={styles['D2CBasket-itemThumb']}
                          />
                        </a>
                      </div>
                      <div className={styles['D2CBasket-itemColumn--title']}>
                        <span className={styles['D2CBasket-itemModelId']}>
                          {item.productCode}
                        </span>
                        <h3
                          title="Frigocongelatore REX® Retrò Serie 600 TwinTech® Total No Frost 175.1 cm"
                          className={styles['D2CBasket-itemName']}
                        >
                          {item.productName}
                        </h3>
                      </div>
                    </div>
                    <div className={styles['D2CBasket-itemRow--totals']}>
                      <div className={styles['D2CBasket-itemColumn--stock']}>
                        <span className={styles['D2CBasket-itemStock']}>
                          Disponibile
                        </span>
                        <div
                          className={
                            styles['D2CBasket-itemWithDiscountedPrice']
                          }
                        >
                          <div className={styles['D2CBasket-originalPrice']}>
                            € 1.361,99
                          </div>
                          <div className={styles['D2CBasket-discountedPrice']}>
                            {item.price}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          styles['D2CBasket-itemColumn--quantityPrice']
                        }
                      >
                        <div
                          className={
                            styles['D2CBasket-itemInputQuantityControls']
                          }
                        >
                          <button
                            type="button"
                            className={styles['D2CBasket-decrementItem']}
                            onClick={() => addToCart(item, false)}
                          ></button>
                          <input
                            type="number"
                            className={styles['D2CBasket-quantityInput']}
                            value={item.quantity}
                          />
                          <button
                            type="button"
                            className={styles['D2CBasket-incrementItem']}
                            onClick={() => addToCart(item, true)}
                            ></button>
                        </div>
                        <div className={styles['D2CBasket-itemPrice']}>
                          € {item.total}
                        </div>
                      </div>
                    </div>
                    <div className={styles['D2CBasket-itemPromotions']}>
                      <div className={styles['D2CBasket-promotion']}>
                        <svg
                          viewBox="0 0 18 17"
                          className={styles['SvgIcon SvgIcon--voucher-star']}
                        >
                          <path d="M9 0l2.752 5.637L18 6.493l-4.548 4.34L14.562 17 9 14.045l-5.562 2.954 1.11-6.166L0 6.493l6.249-.856z"></path>
                        </svg>
                        <p className={styles['D2CBasket-promotion-name']}>
                          Prezzo speciale
                        </p>
                        <button
                          type="button"
                          className={styles['D2CBasket-promotion-details']}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="SvgIcon SvgIcon--information-tag"
                          >
                            <path d="M12 2.329A9.666 9.666 0 0121.67 12 9.664 9.664 0 0112 21.671 9.665 9.665 0 012.33 12 9.665 9.665 0 0112 2.329zm0-2.33C5.372-.001 0 5.373 0 12s5.372 12.001 12 12.001S24 18.627 24 12 18.628-.001 12-.001zM13.738 18.5H10.38v-7.98h3.358v7.98zm-1.679-9.631a1.848 1.848 0 11-.001-3.697 1.848 1.848 0 01.001 3.697z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className={styles['D2CBasket-additional-services']}>
                      <div className={styles['D2CBasket-additional-service']}>
                        <svg
                          viewBox="0 0 16 18"
                          className="SvgIcon SvgIcon--hand-support"
                        >
                          <path d="M5.59.745c.934 0 1.704.676 1.786 1.54l.008.155v2.926h1.069c.473 0 .89.225 1.141.567l.077.119.043.085h1.194c.472 0 .89.224 1.14.567l.078.118.044.085h.784c.88 0 1.613.6 1.765 1.39l.022.15.007.155v2.387c0 .638-.079 1.274-.234 1.896l-.103.37-1.322 4.355a.558.558 0 01-.452.383l-.093.007H5.18a.578.578 0 01-.452-.214l-.098-.124-.218-.29-.247-.341-.275-.393-.465-.678-.521-.782-.754-1.152-.791-1.23-1.16-1.83A1.404 1.404 0 01.456 9.21a1.618 1.618 0 011.973-.169l.127.092 1.239 1V2.44c0-.833.636-1.525 1.473-1.668l.159-.02.163-.007zm0 1.078c-.33 0-.602.225-.652.517l-.01.1v8.858c0 .429-.492.674-.857.464l-.076-.053L1.82 9.955a.438.438 0 00-.566.02.369.369 0 00-.07.447l.051.083 1.094 1.73.787 1.225.762 1.166.553.827.628.91.263.364.145.195h6.65l1.204-3.965c.124-.41.21-.83.254-1.252l.027-.318.012-.398V8.602c0-.305-.239-.56-.553-.608l-.107-.008h-.66v.77c0 .298-.255.54-.568.54a.56.56 0 01-.558-.443l-.01-.097v-1.31a.236.236 0 00-.183-.222l-.067-.008h-1.07v.821c0 .298-.253.54-.567.54a.56.56 0 01-.558-.443l-.009-.097v-1.36a.236.236 0 00-.184-.223l-.067-.009h-1.07v1.592c0 .298-.253.54-.567.54a.56.56 0 01-.558-.443l-.009-.097V2.44c0-.34-.294-.617-.66-.617zM14.18 0v1.896H16V2.92h-1.82v1.881h-1.168v-1.88h-1.824V1.895h1.824V0h1.169z"></path>
                        </svg>
                        <p
                          className={
                            styles['D2CBasket-additional-service-name']
                          }
                        >
                          Potrai selezionare ulteriori servizi nei prossimi
                          passaggi
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles['D2CBasket-itemDelete']}
                    >
                      <span className={styles['D2CBasket-itemDelete-text']}>
                        Elimina
                      </span>
                      <svg
                        viewBox="0 0 12.1 12.1"
                        className={styles['SvgIcon SvgIcon--close']}
                      >
                        <path d="M6.1 4.9L11 0l1.1 1.1-4.9 5 4.9 4.9-1.1 1.1-4.9-4.9-4.9 4.9L0 11l4.9-4.9-4.9-5L1.1 0l5 4.9z"></path>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className={`${styles['D2CBasket-basketPanel']} ${styles['D2CBasket-basketPanel--summary']}`}
          >
            <div className={styles['D2CBasket-voucher']}>
              <div className={styles['D2CBasket-voucherCta']}>
                <input
                  id="voucher-cta"
                  type="checkbox"
                  className={styles['Checkbox-input']}
                  checked={hasVoucher}
                  onChange={() => setHasVoucher(!hasVoucher)}
                />
                <span
                  aria-hidden="true"
                  className={styles['Checkbox-icon']}
                ></span>
                <label
                  htmlFor="voucher-cta"
                  className={styles['Checkbox-label']}
                >
                  Ho un codice sconto
                </label>
              </div>
              <div style={{ display: 'none' }}>
                <div className="D2CBasket-voucherRow">
                  <input
                    type="text"
                    placeholder="Inserisci il codice sconto"
                    className="D2CBasket-voucherCodeInput"
                  />
                  <button
                    disabled={true}
                    className="D2CBasket-voucherSubmit btn btn-primary btn-cta"
                  >
                    Applica
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['D2CBasket-basketFooter']}>
            <div className={styles['D2CBasket-total']}>
              <div
                className={`${styles['D2CBasket-total__item']} ${styles['D2CBasket-total__item__risparam']}`}
              >
                <div className={styles['D2CBasket-totalKey']}>Risparmio:</div>
                <div
                  className={`${styles['D2CBasket-total__value']} ${styles['D2CBasket-total__value__risparam']}`}
                >
                  € 562
                </div>
              </div>
              <div
                className={`${styles['D2CBasket-total__item']} ${styles['D2CBasket-total__item__total']}`}
              >
                <div
                  className={`${styles['D2CBasket-totalKey']} ${styles['D2CBasket-totalKey_total']}`}
                >
                  Totale:
                </div>
                <div className={styles['D2CBasket-total__value']}>€ {totalPrice}</div>
              </div>
              <div className="D2CBasket-totalRow D2CBasket-totalRow--swap-order-3">
                <div className="D2CBasket-totalMessage">
                  Il tuo ordine include € 144,26 di IVA
                </div>
              </div>
            </div>
          </div>
          <div className={styles['D2C-klarnaMessage']}>
            <div className={styles['D2C-klarnaMessage__right']}>
              <span>klarna</span>
              <span>Paga in 3 rate da 266,66€ senza interessi.</span>
              <span>Maggiori informazioni</span>
            </div>
          </div>
          <div className={styles['D2CBasket-ctas']}>
            <div className={styles['D2CBasket-ctas__left']}>
              Continua con gli acquisti
            </div>
            <div className={styles['D2CBasket-ctas__right']}>
              <div>Continua eseguendo il login</div>
              <div>continua come ospite</div>
            </div>
          </div>
          <div className={styles['D2CBasket-help']}>
            <svg viewBox="0 0 24 24" className={styles['SvgIcon']}>
              <path d="M12 2.329A9.666 9.666 0 0121.67 12 9.664 9.664 0 0112 21.671 9.665 9.665 0 012.33 12 9.665 9.665 0 0112 2.329zm0-2.33C5.372-.001 0 5.373 0 12s5.372 12.001 12 12.001S24 18.627 24 12 18.628-.001 12-.001zM13.738 18.5H10.38v-7.98h3.358v7.98zm-1.679-9.631a1.848 1.848 0 11-.001-3.697 1.848 1.848 0 01.001 3.697z"></path>
            </svg>
            <span>Hai bisogno di aiuto? Contatta il numero</span>
            <a href="tel:04341580088" className="outleads_call_area">
              0434 1580088
            </a>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
