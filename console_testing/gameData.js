const data = require('./gameData.json').entities;


function getOxygenProduction(duplicantCount) {
	const oxygenConsumed = data.duplicant.consumes.oxygen.baseValue * duplicantCount;

	console.log(`${duplicantCount} duplicants consume ${oxygenConsumed} g/s oxygen`);

	const logProducerCalculations = function(producer) {
		let count = Math.ceil(oxygenConsumed/producer.produces.oxygen.baseValue);
		console.log(`${producer.name}: ${count} required`);
		console.log('    produces:');
		for (resource in producer.produces) {
			console.log(`        ${resource}: +${producer.produces[resource]['baseValue'] * count} ${producer.produces[resource]['units']}`);
		}
		console.log('    consumes:');
		for (resource in producer.consumes) {
			console.log(`        ${resource}: -${producer.consumes[resource]['baseValue'] * count} ${producer.consumes[resource]['units']}`);
		}
	}

	for (producer in data.oxygenProduction) {
		logProducerCalculations(data.oxygenProduction[producer]);
	}
}




getOxygenProduction(6);

