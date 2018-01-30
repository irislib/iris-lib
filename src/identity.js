class Identity {
  constructor(data) {
    this.data = data;
  }

  verified(attribute) {
    let v;
    let best = 0;
    this.data.attrs.forEach(a => {
      if (a.name === attribute && a.pos * 2 > a.neg * 3 && a.pos - a.neg > best) {
        v = a.val;
        best = a.pos - a.neg;
      }
    });
    return v;
  }

  profileCard() {
    return;
  }

  avatar() {
    return;
  }
}

export default Identity;
