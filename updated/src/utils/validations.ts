import moment from 'moment';

const email_validation_keyset: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}]))|((([a-zA-Z\-0-9]+\.){1,2})[a-zA-Z]{2,}))$/;

export const Validation = {
  // check empty, undefined, or null string
  isEmpty: function (value: string = ''): boolean {
    try {
      if (value.trim() === '') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error to check empty string >>>>> ', e);
      return false;
    }
  },
  isTrue: function (value: any): boolean {
    try {
      if (value === true) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },

  // Check Email is valid or not
  isValidEmail: function (value: string): boolean {
    const CHECK_EMAIL: RegExp = email_validation_keyset;

    if (CHECK_EMAIL.test(value.trim()) === false) {
      return false;
    }
    return true;
  },

  // Check Password Validation
  isValidPassword: function (value: string): boolean {
    return !this.isEmpty(value) && value.length >= 8;
  },

  // Check phone no Validation
  isValidPhoneNo: function (value: string): boolean {
    return !this.isEmpty(value) && value.length >= 12;
  },
  isAcceptTerms: function (value: any): boolean {
    return !!value;
  },
};

export const convertTimeStamp = (createdDate: string): string => {
  let createdate = moment.utc(createdDate);
  let localdate = moment(createdate).local().format('MM-DD-YY HH-mm-ss');
  let createtime = moment(createdDate).format('MM-DD-YY');

  const postCreateDate = moment(createdate, 'MM-DD-YY HH-mm-ss');
  const nowDate = moment().local();
  const diffsec = nowDate.diff(postCreateDate, 'seconds');
  const diffmin = nowDate.diff(postCreateDate, 'minutes');
  const diffh = nowDate.diff(postCreateDate, 'hour');
  const diffday = nowDate.diff(postCreateDate, 'days');

  if (diffsec < 60) {
    return 'Just Now';
  } else if (diffmin < 60) {
    return diffmin + ' m';
  } else if (diffh < 24) {
    return diffh + ' h';
  } else if (diffday < 3 && diffday >= 1) {
    return diffday + ' d';
  } else {
    return createtime + '';
  }
};

export const compareTime = (endDate: string): string => {
  let currentDate = new Date().getDate();

  let localEndDate = moment.utc(endDate);
  // let currentTime = moment().utcOffset('+05:30').format('YYYY-MM-DD hh:mm:ss');
  let currentTime = moment();

  const diff = localEndDate.diff(currentTime, 'h');
  if (diff === 1) {
    return 'Expires Soon';
  } else if (diff <= 0) {
    return 'Expired';
  } else {
    return 'Expires in ' + diff + ' hours';
  }
};

export const compareDate = (date: string): string => {
  // let currentDate = moment().format('MM/DD/YYYY');
  let currentDate = new Date();
  let EndDate = new Date(date);
  const diffInMs = EndDate.getTime() - currentDate.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1 && diffInDays !== -1) {
    return 'in ' + diffInDays + ' day';
  } else if (diffInDays > 1) {
    return 'in ' + diffInDays + ' days';
  } else {
    return '';
  }
};
