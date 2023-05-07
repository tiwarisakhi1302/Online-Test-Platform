
dict = {}

var obj = {
    hi : 123,
    hih : "htht"
}
dict["helloow"] = obj;

obj.hi = 456;

dict["hwhwh"] = obj;
console.log(dict)

obj.hih = 1231;

dict["sdasd"] = obj;


for (const [key, value] of Object.entries(dict)) {
    console.log(key, value);
  } 

console.log("\n");
delete dict["helloow"];

  for (const [key, value] of Object.entries(dict)) {
    console.log(key, value);
  } 