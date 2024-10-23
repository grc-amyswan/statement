import invoices from '../data/invoices.json';
import plays from '../data/plays.json';

const invoice = invoices[0];

export default function statement (invoice) {
	let result = `Statement for ${invoice.customer}\n`;
	
	for (let perf of invoice.performances) {
		// print line for this order
		result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
	}
	
	result += `Amount owed is ${usd(totalAmount())}\n`;
	result += `You earned ${totalVolumeCredits()} credits\n`;
	return result;
}

function amountFor(aPerformance) {
	let result = 0;

	switch (playFor(aPerformance).type) {
		case "tragedy":
			result = 40000;
			if (aPerformance.audience > 30) {
				result += 1000 * (aPerformance.audience - 30);
			}
			break;
		case "comedy":
			result = 30000;
			if (aPerformance.audience > 20) {
				result += 10000 + 500 * (aPerformance.audience - 20);
			}
			result += 300 * aPerformance.audience;
			break;
		default:
			throw new Error(`unknown type: ${playFor(aPerformance).type}`);
	}
	return result;
}

function totalAmount() {
	let totalAmount = 0;
	for (let perf of invoice.performances) {
		totalAmount += amountFor(perf);
	}
	return totalAmount;
}

function playFor(aPerformance) {
	return plays[aPerformance.playID];
}

function totalVolumeCredits() {
	let volumeCredits = 0;
	for (let perf of invoice.performances) {
		volumeCredits += volumeCreditsFor(perf);
	}
	return volumeCredits;
}

function usd(aNumber) {
	return new Intl.NumberFormat("en-US",
		{ style: "currency", currency: "USD",
		  minimumFractionDigits: 2 }).format(aNumber/100);
}

function volumeCreditsFor(aPerformance) {
	let volumeCredits = 0;
	volumeCredits += Math.max(aPerformance.audience - 30, 0);
	if ("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience / 5);
	return volumeCredits;
}
