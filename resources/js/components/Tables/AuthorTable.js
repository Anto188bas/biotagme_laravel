import React from "react";
import { Table } from 'reactstrap';


export default class AuthorTable extends React.Component {
    constructor(props) {
        super(props);
        this.catania_author_map = {
            1 : ["Antonio",   "Di Maria",   "antoniodm@unict.it"],
            2 : ["Salvatore", "Alaimo",     "salvatore.alaimo@unict.it"],
            3 : ["Alfredo",   "Ferro",      "alfredo.ferro@unict.it"],
            4 : ["Alfredo",   "Pulvirenti", "alfredo.pulvirenti@unict.it"]
        };
        this.pista_author_map   = {
            1 : ["Paolo",     "Ferragina",  "paolo.ferragina@unipi.it"]
        }
    }

    get_map() {
        return this.props.type === 1 ? this.catania_author_map : this.pista_author_map
    }

    render(){
        return(
            <Table borderless>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>E-mail</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.entries(this.get_map()).map((values, key) =>
                        <tr key={key}>
                             <th scope="row">{values[0]}</th>
                             <td>{values[1][0]}</td>
                             <td>{values[1][1]}</td>
                             <td><a href="#">{values[1][2]}</a></td>
                        </tr>
                    )
                }
                </tbody>
            </Table>
        )
    }

}
