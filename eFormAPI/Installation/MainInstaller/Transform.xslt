<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:wix="http://schemas.microsoft.com/wix/2006/wi" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">

  <xsl:output method="xml" indent="yes"/>
  <xsl:strip-space elements="*"/>
  
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:key name="files-search" match="wix:Component[not(contains(wix:File/@Source, '.dll')) and (contains(wix:File/@Source, '.cs'))]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'Resources')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'Properties')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'obj')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'pdb')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'Microsoft.Data.Edm.resources.dll')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'Microsoft.Data.OData.resources.dll')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'System.Spatial.resources.dll')]" use="@Id"/>
  <xsl:key name="files-search" match="wix:Component[contains(wix:File/@Source, 'eFormAPI.Web.runtimeconfig.dev.json')]" use="@Id"/>
  <xsl:key name="dir-search" match="wix:Component[contains(wix:Directory/@Name, 'bin')]" use="@Id"/>
  

  <xsl:template match="wix:Component[key('files-search', @Id)]"/>
  <xsl:template match="wix:ComponentRef[key('files-search', @Id)]"/>

  <xsl:template match="wix:Directory[contains(@Name, 'Abstractions')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Controllers')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Hosting')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Infrastructure')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Models')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Seed')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Migrations')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Resources')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'obj')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Properties')]"/>
  <xsl:template match="wix:Directory[contains(@Name, 'Services')]"/>
  <xsl:template match="wix:ComponentRef[key('dir-search', @Id)]"/>
</xsl:stylesheet>