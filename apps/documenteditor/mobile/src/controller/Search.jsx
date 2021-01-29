import React from 'react';
import { List, ListItem, Toggle } from 'framework7-react';
import { SearchController, SearchView, SearchSettingsView } from '../../../../common/mobile/lib/controller/Search';
import { f7 } from 'framework7-react';


class SearchSettings extends SearchSettingsView {
    constructor(props) {
        super(props);

        this.onToggleMarkResults = this.onToggleMarkResults.bind(this);
    }

    onToggleMarkResults(checked) {
        const api = Common.EditorApi.get();
        api.asc_selectSearchingResults(checked);
    }

    extraSearchOptions() {
        const anc_markup = super.extraSearchOptions();

        const markup = <List>
                        <ListItem title="Case sensitive">
                            <Toggle slot="after" className="toggle-case-sensitive" />
                        </ListItem>
                        <ListItem title="Highlight results">
                            <Toggle slot="after" className="toggle-mark-results" defaultChecked onToggleChange={this.onToggleMarkResults} />
                        </ListItem>
                    </List>;

        return {...anc_markup, ...markup};
    }
}

class DESearchView extends SearchView {
    searchParams() {
        let params = super.searchParams();

        const checkboxCaseSensitive = f7.toggle.get('.toggle-case-sensitive'),
            checkboxMarkResults = f7.toggle.get('.toggle-mark-results');
        const searchOptions = {
            caseSensitive: checkboxCaseSensitive.checked,
            highlight: checkboxMarkResults.checked
        };

        return {...params, ...searchOptions};
    }

    onSearchbarShow(isshowed, bar) {
        super.onSearchbarShow(isshowed, bar);

        const api = Common.EditorApi.get();
        if ( isshowed ) {
            const checkboxMarkResults = f7.toggle.get('.toggle-mark-results');
            api.asc_selectSearchingResults(checkboxMarkResults.checked);
        } else api.asc_selectSearchingResults(false);
    }
}

const Search = props => {
    const onSearchQuery = params => {
        const api = Common.EditorApi.get();

        if ( !params.replace ) {
            if ( !api.asc_findText(params.find, params.forward, params.caseSensitive, params.highlight) ) {
                f7.dialog.alert('there are no more results', e => {
                });
            }
        }
    };

    return <DESearchView onSearchQuery={onSearchQuery} />
};

export {Search, SearchSettings}
