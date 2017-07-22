import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const gameData = require('./gameData.json');

class ResourceChange extends React.Component {
	render() {
		return (
			<ul>
				{this.getChangeList()}
			</ul>
		);
	}
	getChangeList() {
		let changes = [];
		let sign = (this.props.resourceChange === "consumes") ? "-" : "+";
		let ent = gameData.entities[this.props.name];
		for (let resource in ent[this.props.resourceChange]) {
			changes.push(<p>{sign}{gameData.resources[resource].name} {ent[this.props.resourceChange][resource]} {gameData.resources[resource].units}</p>);
		}
		return changes;
	}
}

class Entity extends React.Component {
	render() {
		return(
			<tr>
				<td>{gameData.entities[this.props.name].name}</td>
				<td><ResourceChange name={this.props.name} resourceChange="consumes" /></td>
				<td><ResourceChange name={this.props.name} resourceChange="produces" /></td>
				<td><button onClick={this.props.remove}>-</button> {this.props.count} <button onClick={this.props.add}>+</button></td>
				<td>{this.getNet()}</td>
			</tr>
		);
	}
	getNet() {
		let net = [];
		let consumes = gameData.entities[this.props.name].consumes;
		for (let consumed in consumes) {
			net.push(<p>-{gameData.resources[consumed].name} {this.props.count * consumes[consumed]} {gameData.resources[consumed].units}</p>)
		}
		let produces = gameData.entities[this.props.name].produces;
		for (let produced in produces) {
			net.push(<p>+{gameData.resources[produced].name} {this.props.count * produces[produced]} {gameData.resources[produced].units}</p>);
		}
		return net;
	}
}

class EntityTable extends React.Component {
	constructor() {
		super();
		let ents = {};
		for (let entity in gameData.entities) {
			ents[entity] = 0;
		}
		this.state = {
			entities: ents
		};
	}
	render() {
		return (
		<table>
		<tr><td><p>{this.getNetList()}</p></td>
		<td><table>
			<tr>
				<th>Name</th>
				<th>Consumes:</th>
				<th>Produces:</th>
				<th></th>
				<th>Net:</th>
			</tr>
			{this.getRows()}
			</table></td></tr>
		</table>
		);
	}
	add(name) {
		this.state.entities[name]++;
		this.setState();
	}
	remove(name) {
		if (this.state.entities[name] > 0) {
			this.state.entities[name]--;
			this.setState();
		};
	}
	getRows() {
		let output = [];
		for (let entity in gameData.entities) {
			output.push(<Entity name={entity} count={this.state.entities[entity]} add={() => this.add(entity)} remove={() => this.remove(entity)} />);
		}
		return output;
	}
	getNetList() {
		let net = {};
		let output = [];
		for (let entity in this.state.entities) {
			for (let consumed in gameData.entities[entity].consumes) {
				if (consumed in net) {
					net[consumed] -= gameData.entities[entity].consumes[consumed] * this.state.entities[entity];
				} else {
					net[consumed] = -gameData.entities[entity].consumes[consumed] * this.state.entities[entity];
				}
			}
			for (let produced in gameData.entities[entity].produces) {
				if (produced in net) {
					net[produced] += gameData.entities[entity].produces[produced] * this.state.entities[entity];
				} else {
					net[produced] = gameData.entities[entity].produces[produced] * this.state.entities[entity];
				}
			}
		}
		for (let item in net) {
			output.push(<p>{net[item]} {gameData.resources[item].units} {gameData.resources[item].name}</p>);
		}
		return output;
	}
}




ReactDOM.render(
	<EntityTable />,
	document.getElementById('root')
);