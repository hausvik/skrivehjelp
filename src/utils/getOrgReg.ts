import axios from 'axios';

interface OrgUnit {
    ouId: number;
    name: {
        eng?: string;
        nob?: string;
        nno?: string;
    };
    children: number[];
}

let cachedOrgUnits: OrgUnit[] | null = null;

// Function to fetch data and cache it
export async function fetchOrgUnits(): Promise<OrgUnit[]> {
    if (cachedOrgUnits) {
        return cachedOrgUnits;
    }

    try {
        const response = await axios.get<OrgUnit[]>(`https://gw-uib.intark.uh-it.no/orgreg/v3/ou`);
        cachedOrgUnits = response.data;
        return cachedOrgUnits;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getChildren(parentID: number): Promise<OrgUnit[]> {
    try {
        const orgUnits = await fetchOrgUnits();

        const parentUnit = orgUnits.find(unit => unit.ouId === parentID);
        if (!parentUnit) {
            throw new Error(`Parent with ID ${parentID} not found`);
        }

        const childrenUnits = parentUnit.children.map(childId => {
            return orgUnits.find(unit => unit.ouId === childId) || null;
        }).filter(unit => unit !== null) as OrgUnit[];

        return childrenUnits;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}