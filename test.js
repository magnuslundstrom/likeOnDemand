const f = async () => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('y');
      resolve();
    }, Math.random() * 3 * 1000);
  });
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('x');
      resolve();
    }, Math.random() * 3 * 1000);
  });
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('d');
      resolve();
    }, Math.random() * 3 * 1000);
  });
};

f();
