import {SOCIAL_DETAIL} from '../components/socialDetail';

class PaymentGateway {
  callApi(url, method, object) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: method,
        headers: {
          Authorization: `bearer ${SOCIAL_DETAIL.STRIPE_SK_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: object,
      })
        .then(response => response.json())
        .then(responseJson => resolve(responseJson))
        .catch(error => reject({object: error}));
    });
  }

  newCardAdd(object) {
    let formBody = [];
    for (let property in object) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(object[property]);
      formBody.push('card[' + encodedKey + ']=' + encodedValue);
    }
    formBody = formBody.join('&');
    return new Promise((resolve, reject) => {
      this.callApi('https://api.stripe.com/v1/tokens', 'POST', formBody)
        .then(response => {
          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  allCard(id) {
    return new Promise((resolve, reject) => {
      this.callApi(
        'https://api.stripe.com/v1/customers/' + id + '/sources?object=card',
        'GET',
      )
        .then(response => {
          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch(error => reject(error));
    });
  }
  chargeCard(object) {
    let formBody = [];
    for (let property in object) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(object[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return new Promise((resolve, reject) => {
      this.callApi('https://api.stripe.com/v1/charges', 'POST', formBody)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
  setPrimaryCard(cust_id, source) {
    // console.log('source >>>> ', source);
    return new Promise((resolve, reject) => {
      this.callApi(
        'https://api.stripe.com/v1/customers/' +
          cust_id +
          '?default_source=' +
          source,
        'POST',
      )
        .then(response => {
          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch(error => reject(error));
    });
  }
  deleteCard(cust_id, card_token) {
    return new Promise((resolve, reject) => {
      this.callApi(
        'https://api.stripe.com/v1/customers/' +
          cust_id +
          '/sources/' +
          card_token,
        'DELETE',
      )
        .then(response => {
          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch(error => reject(error));
    });
  }
  newCardCustomerAdd(cust_id, object) {
    let formBody = [];
    for (let property in object) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(object[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    return new Promise((resolve, reject) => {
      this.callApi(
        'https://api.stripe.com/v1/customers/' + cust_id + '/sources',
        'POST',
        formBody,
      )
        .then(response => {
          if (response.error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch(error => reject(error));
    });
  }
}
const PaymentGatewayServices = new PaymentGateway();
export default PaymentGatewayServices;
