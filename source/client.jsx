import { utc } from 'moment';
import { Component } from 'inferno';

class Hello extends Component {
	render() {
		return (
		<div>
				Hello Inferno + FuseBox{' '}
				{utc(new Date())
					.format('DD/MM/YY')
					.toString()}
			</div>
		)
	}
}

export default Hello;
