const random = (cant) => {
  const params = Number(cant);
  const randoms = {};

  for (let i= 0; i < params; i++){
    const n = Math.floor((Math.random() * (1000)) + 1)
    
    if (!randoms[n]) {
      randoms[n] = 1
    } else {
      randoms[n] ++ 
    }
  }
  return randoms;
}

process.on('message', cant => {
  const result = random(cant)
  process.send(result)
} )

