const { NlpManager } = require('node-nlp');
const fs = require('fs');

const manager = new NlpManager({ languages: ['tr'], 
  nlu: { log: true, useNoneFeature: false },
  ner: { builtins: [] }
});

(async() => {
  /* let data = fs.readFileSync('sikayet.json', 'utf8');
  data = JSON.parse(data);
  for (let d of data) {
    manager.addDocument(d.language, d.utterance, d.intent);
  }
  console.log('mutluluk modeli okunuyor...');
  data = fs.readFileSync('mutluluk.json', 'utf8');
  data = JSON.parse(data);
  console.log('mutluluk modeli parse edildi.');
  let i = 0;
  for (let d of data) {
    console.log(`${i} / ${data.length}`);
    manager.addDocument(d.language, d.utterance, d.intent);
    i++;
  }
  await manager.train();
  manager.save('nlpModel'); */
  manager.load('nlpModel');
  const response = await manager.process(process.argv[2]);
  console.log(JSON.stringify(response));
})();
