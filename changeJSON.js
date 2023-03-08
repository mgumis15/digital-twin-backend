const fs = require('fs');

let storeFile=JSON.parse(fs.readFileSync("data/fakeStore.json"));
for(let i=1;i<=10;i++){
    if(i%2==1)
        x=(Math.floor(i/2)+1)*4
    else
        x=(Math.floor(i/2-1)+1)*4+1
    for(let j=0;j<10;j++){
            storeFile.products[(i-1)*10+j].localization.x=x
            storeFile.products[(i-1)*10+j].localization.y=3+j*2
    }
}

fs.writeFile("data/fakeStore.json",JSON.stringify(storeFile),'utf8',()=>{})