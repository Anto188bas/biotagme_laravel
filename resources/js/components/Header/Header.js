import React, {Component} from "react";
import {
    Navbar,
    NavbarBrand,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavItem, NavLink
} from "reactstrap";
import {NavLink as RouterNavLink } from 'react-router-dom';


const MyNavLink = ({ href, children, ...props }) => {
    return <RouterNavLink to={href} {...props}>{children}</RouterNavLink>;
};


export class Header extends Component {
    getLinksArray = ()=> {
        return [
            {STRING:    'https://string-db.org/'},
            {HGNC:      'https://www.genenames.org/'},
            {KEGG:      'https://www.kegg.jp/kegg/'},
            {DRUGBANK:  'https://www.drugbank.ca/'},
            {DisGeNET:  'https://www.disgenet.org/'},
            {PHARMGKB:  'https://www.pharmgkb.org/'},
            {GeneOntology:'http://geneontology.org/'},
            {TAGME:     'https://tagme.d4science.org/tagme/'},
            {DT_Hybrid: 'https://alpha.dmi.unict.it/dtweb/dthybrid.php'}
        ];
    };

    render() {
        return (
            <header>
            <Navbar light expand="md">
                <NavbarBrand>BioTAGME</NavbarBrand>
                <Nav className='ml-auto'>
                    <NavItem>
                        <NavLink href="/" tag={MyNavLink}>Home</NavLink>
                    </NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Browse
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right">
                            {this.getLinksArray().map((link,idx) =>
                                Object.keys(link).map(k =>
                                    <DropdownItem key={idx} tag={'a'} href={link[k]} target="_blank">
                                        {k}
                                    </DropdownItem>
                                )
                            )}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Navbar>
            </header>
        )
    }
}
