export default {
  XML: `<Main>
    <Id>12</Id>
    <Repeated>0</Repeated>
    <Label>TEST_LABEL</Label>
    <Description></Description>
    <StartDate>2012-08-09</StartDate>
    <EndDate>2022-08-09</EndDate>
    <Language>da</Language>
    <MultiApproval>false</MultiApproval>
    <FastNavigation>false</FastNavigation>
    <Review>false</Review>
    <Summary>false</Summary>
    <DisplayOrder>3164</DisplayOrder>
    <CheckListFolderName>Storebælt - Skinneudtræk 2 mdr.</CheckListFolderName>
    <ElementList>
        <Element type="DataElement">
            <Id>13</Id>
            <Label>Målinger</Label>
            <DisplayOrder>1</DisplayOrder>
            <ReviewEnabled>true</ReviewEnabled>
            <ManualSync>false</ManualSync>
            <ExtraFieldsEnabled>true</ExtraFieldsEnabled>
            <DoneButtonDisabled>false</DoneButtonDisabled>
            <ApprovalEnabled>true</ApprovalEnabled>
            <DataItemList>
                <DataItem type="number">
                    <Id>59</Id>
                    <Label>Skinnetemperatur</Label>
                    <Description>C</Description>
                    <MinValue>-15000</MinValue>
                    <MaxValue>15000</MaxValue>
                    <Value></Value>
                    <DecimalCount>2</DecimalCount>
                    <UnitName></UnitName>
                    <Mandatory>false</Mandatory>
                </DataItem>
            </DataItemList>
        </Element>
        <Element type="DataElement">
            <Id>19</Id>
            <Label>Skinneudtrækkets stilling</Label>
            <DisplayOrder>3</DisplayOrder>
            <ReviewEnabled>false</ReviewEnabled>
            <ManualSync>false</ManualSync>
            <ExtraFieldsEnabled>true</ExtraFieldsEnabled>
            <DoneButtonDisabled>false</DoneButtonDisabled>
            <ApprovalEnabled>true</ApprovalEnabled>
            <DataItemList>
                <DataItem type="number">
                    <Id>93</Id>
                    <Label>Sprogø-enden (venstre streng)</Label>
                    <Description>mm</Description>
                    <MinValue>-15000</MinValue>
                    <MaxValue>15000</MaxValue>
                    <Value></Value>
                    <DecimalCount>2</DecimalCount>
                    <UnitName></UnitName>
                    <Mandatory>false</Mandatory>
                </DataItem>
            </DataItemList>
        </Element>
        <Element type="DataElement">
            <Id>20</Id>
            <Label>Sporvidde</Label>
            <DisplayOrder>4</DisplayOrder>
            <ReviewEnabled>false</ReviewEnabled>
            <ManualSync>false</ManualSync>
            <ExtraFieldsEnabled>true</ExtraFieldsEnabled>
            <DoneButtonDisabled>false</DoneButtonDisabled>
            <ApprovalEnabled>true</ApprovalEnabled>
            <DataItemList>
                <DataItem type="number">
                    <Id>102</Id>
                    <Label>Sporvidde 1</Label>
                    <Description>(1430 - 1450 mm)</Description>
                    <MinValue>1000</MinValue>
                    <MaxValue>1500</MaxValue>
                    <Value></Value>
                    <DecimalCount>2</DecimalCount>
                    <UnitName></UnitName>
                    <Mandatory>false</Mandatory>
                </DataItem>
            </DataItemList>
        </Element>
        <Element type="DataElement">
            <Id>21</Id>
            <Label>Smørring</Label>
            <DisplayOrder>5</DisplayOrder>
            <ReviewEnabled>false</ReviewEnabled>
            <ManualSync>false</ManualSync>
            <ExtraFieldsEnabled>true</ExtraFieldsEnabled>
            <DoneButtonDisabled>false</DoneButtonDisabled>
            <ApprovalEnabled>true</ApprovalEnabled>
            <DataItemList>
                <DataItem type="single_select">
                    <Id>110</Id>
                    <Label>Kontaktflade sideskinne/tunge</Label>
                    <Description>Smøring udført</Description>
                    <KeyValuePairList>
                        <KeyValuePair>
                            <Key>1</Key>
                            <Value>Ja</Value>
                            <Selected>false</Selected>
                            <DisplayOrder>0</DisplayOrder>
                        </KeyValuePair>
                        <KeyValuePair>
                            <Key>2</Key>
                            <Value>Nej</Value>
                            <Selected>false</Selected>
                            <DisplayOrder>1</DisplayOrder>
                        </KeyValuePair>
                    </KeyValuePairList>
                    <Mandatory>false</Mandatory>
                </DataItem>
            </DataItemList>
        </Element>
        <Element type="DataElement">
            <Id>22</Id>
            <Label>Kontrol af tilspændinger</Label>
            <DisplayOrder>6</DisplayOrder>
            <ReviewEnabled>false</ReviewEnabled>
            <ManualSync>false</ManualSync>
            <ExtraFieldsEnabled>true</ExtraFieldsEnabled>
            <DoneButtonDisabled>false</DoneButtonDisabled>
            <ApprovalEnabled>true</ApprovalEnabled>
            <DataItemList>
                <DataItem type="single_select">
                    <Id>115</Id>
                    <Label>Befæstelse ved tunger</Label>
                    <Description>Moment 250Nm</Description>
                    <KeyValuePairList>
                        <KeyValuePair>
                            <Key>1</Key>
                            <Value>OK</Value>
                            <Selected>false</Selected>
                            <DisplayOrder>0</DisplayOrder>
                        </KeyValuePair>
                        <KeyValuePair>
                            <Key>2</Key>
                            <Value>ikke OK</Value>
                            <Selected>false</Selected>
                            <DisplayOrder>1</DisplayOrder>
                        </KeyValuePair>
                    </KeyValuePairList>
                    <Mandatory>false</Mandatory>
                </DataItem>
            </DataItemList>
        </Element>
    </ElementList>
</Main>`,
};
